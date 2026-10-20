import { join } from "node:path";
import { migratedSnippets, migrationKey } from "./snippet_migration_plan.ts";

const homeDirectory = Deno.env.get("HOME");
const configuredSnippetsRoot = Deno.env.get("HSNIPS_BSL_ROOT");
const snippetsRoot = configuredSnippetsRoot ||
  (homeDirectory
    ? join(homeDirectory, ".config", "Code", "User", "hsnips", "bsl")
    : "");
if (!snippetsRoot) {
  throw new Error(
    "Set HSNIPS_BSL_ROOT or HOME to locate the live HyperSnips bsl directory",
  );
}
const projectRoot = decodeURIComponent(new URL("../", import.meta.url).pathname)
  .replace(/\/$/, "");
const modulesRoot = `${projectRoot}/src/CommonModules`;
const configurationPath = `${projectRoot}/src/Configuration.xml`;
const inventoryPath = `${projectRoot}/docs/snippet-migration.md`;
const baselineSnippetCount = 97;
const snippetsDisplayRoot = "$HOME/.config/Code/User/hsnips/bsl";
const retiredScaffolding = [
  "bsl.hsnips :: box",
  "bsl.hsnips :: demo",
  "form/command.hsnips :: test",
] as const;

interface SnippetInfo {
  file: string;
  trigger: string;
  description: string;
}

async function walkFiles(root: string, suffix: string): Promise<string[]> {
  const result: string[] = [];
  async function walk(dir: string) {
    for await (const entry of Deno.readDir(dir)) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory) await walk(path);
      else if (entry.isFile && path.endsWith(suffix)) result.push(path);
    }
  }
  await walk(root);
  return result.sort();
}

function exportedBslSymbols(source: string): string[] {
  const result: string[] = [];
  let pending = "";

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!pending) {
      const declaration = line.match(
        /^(?:Функция|Процедура)\s+([^\s(]+)\s*\(/i,
      );
      if (!declaration) continue;
      pending = declaration[1];
    }

    if (/\bЭкспорт\b/i.test(line)) {
      result.push(pending);
      pending = "";
      continue;
    }

    if (/\)\s*$/.test(line)) pending = "";
  }

  return result;
}

async function readSnippets(): Promise<SnippetInfo[]> {
  const snippets: SnippetInfo[] = [];
  for (const path of await walkFiles(snippetsRoot, ".hsnips")) {
    const relative = path.slice(snippetsRoot.length + 1);
    const text = (await Deno.readTextFile(path))
      .replaceAll("endsnippetsnippet", "endsnippet\nsnippet")
      .replaceAll("endsnippetglobal", "endsnippet\nglobal");
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*snippet\s+(\S+)\s+"([^"]*)"/);
      if (!match) continue;
      snippets.push({
        file: relative,
        trigger: match[1],
        description: match[2],
      });
    }
  }
  return snippets.sort((left, right) =>
    `${left.file}\u0000${left.trigger}`.localeCompare(
      `${right.file}\u0000${right.trigger}`,
    )
  );
}

function templateReason(snippet: SnippetInfo): string {
  if (snippet.file === "macros.hsnips") {
    return "preprocessor/template construct";
  }
  if (
    snippet.file === "query.hsnips" || snippet.trigger === "ЗапросСВыборкой"
  ) {
    return "query/control-flow template";
  }
  if (snippet.file.startsWith("form/")) {
    return "form handler/callback/template context";
  }
  if (snippet.file.startsWith("external_data_proccesor/")) {
    return "external-processor entry point/context template";
  }
  if (
    [
      "НаСервере",
      "НаКлиенте",
      "Тип",
      "Документ",
      "ТипЭлементаФормы",
      "ТекущийПользователь",
      "УникальныйИдентификатор",
      "ЭтоСсылка",
      "Сообщить",
    ].includes(snippet.trigger)
  ) {
    return "editor shortcut; wrapper API would add no abstraction";
  }
  if (
    [
      "Транзакция",
      "ОбратныйПока",
      "НайтиСтроки",
      "Найти",
      "НайтиПоИдентификатору",
      "ВыделенныеСтроки",
    ].includes(snippet.trigger)
  ) {
    return "control-flow template with insertion point";
  }
  return "template/code-generation snippet";
}

function targetSymbols(
  target: string,
): Array<{ module: string; symbol: string }> {
  const result: Array<{ module: string; symbol: string }> = [];
  let module = "";
  for (const rawPart of target.split("/")) {
    const part = rawPart.trim();
    if (!part) continue;
    if (part.includes(".")) {
      const separator = part.indexOf(".");
      module = part.slice(0, separator);
      result.push({ module, symbol: part.slice(separator + 1).trim() });
    } else if (module) {
      result.push({ module, symbol: part });
    }
  }
  return result;
}

const snippets = await readSnippets();
const liveKeys = new Set(
  snippets.map((snippet) => migrationKey(snippet.file, snippet.trigger)),
);
const liveTriggers = new Set(snippets.map((snippet) => snippet.trigger));
const errors: string[] = [];

const integrationSource = await Deno.readTextFile(
  `${modulesRoot}/SharedToolkit_Интеграция/Ext/Module.bsl`,
);
const collectionsSource = await Deno.readTextFile(
  `${modulesRoot}/SharedToolkit_Коллекции/Ext/Module.bsl`,
);
const versioningSource = await Deno.readTextFile(
  `${modulesRoot}/SharedToolkit_Версионирование/Ext/Module.bsl`,
);
const versionReadStart = versioningSource.indexOf(
  "Функция ПрочитатьВерсиюОбъекта(",
);
const versionReadEnd = versioningSource.indexOf(
  "КонецФункции",
  versionReadStart,
);
const versionReadImplementation = versionReadStart < 0 || versionReadEnd < 0
  ? ""
  : versioningSource.slice(versionReadStart, versionReadEnd);
if (
  !/ПредыдущийПривилегированныйРежим = ПривилегированныйРежим\(\)/.test(
    versionReadImplementation,
  ) ||
  !/УстановитьПривилегированныйРежим\(Истина\)/.test(
    versionReadImplementation,
  ) ||
  (versionReadImplementation.match(/УстановитьПривилегированныйРежим\(Ложь\)/g)
      ?.length ?? 0) !== 2
) {
  errors.push(
    "ПрочитатьВерсиюОбъекта must restore the prior privileged mode after both success and failure",
  );
}
const pythonDeclaration = integrationSource.indexOf(
  "Функция ВыполнитьPython(",
);
const pythonImplementation = pythonDeclaration < 0
  ? ""
  : integrationSource.slice(
    pythonDeclaration,
    integrationSource.indexOf("КонецФункции", pythonDeclaration),
  );
if (
  !/&НаСервере\s+Функция ВыполнитьPython\(/.test(integrationSource) ||
  !/ТипЗнч\(ПутьКPython\) <> Тип\("Строка"\)/.test(pythonImplementation) ||
  !/ТипЗнч\(ПутьКСкрипту\) <> Тип\("Строка"\)/.test(pythonImplementation) ||
  !/Не передавайте сюда пути из пользовательского ввода, базы/.test(
    integrationSource,
  )
) {
  errors.push(
    "ВыполнитьPython must remain a documented server API with validated trusted executable/script path inputs",
  );
}
const filterDeclaration = collectionsSource.indexOf(
  "Процедура ФильтроватьКолонки(",
);
const filterDocStart = collectionsSource.lastIndexOf(
  "//  Фильтр - Строка",
  filterDeclaration,
);
const filterDocs = filterDeclaration < 0 ? "" : collectionsSource.slice(
  Math.max(0, filterDocStart),
  filterDeclaration,
);
if (
  !filterDocs.includes("доверенным выражением") ||
  !filterDocs.includes("Не передавайте сюда пользовательский ввод")
) {
  errors.push(
    "ФильтроватьКолонки must document that string filters are trusted BSL and reject untrusted inputs by contract",
  );
}

for (const path of await walkFiles(snippetsRoot, ".hsnips")) {
  const relative = path.slice(snippetsRoot.length + 1);
  const source = await Deno.readTextFile(path);
  for (const match of source.matchAll(/invokeSnippet\("([^"]+)"/g)) {
    const dependency = match[1];
    if (!liveTriggers.has(dependency)) {
      errors.push(
        `Broken invokeSnippet dependency: ${relative} -> ${dependency}`,
      );
    }
  }
}

for (const record of migratedSnippets) {
  if (liveKeys.has(migrationKey(record.file, record.trigger))) {
    errors.push(
      `Migrated snippet is still present: ${record.file} :: ${record.trigger}`,
    );
  }
  for (const { module, symbol } of targetSymbols(record.target)) {
    const moduleFile = `${modulesRoot}/${module}/Ext/Module.bsl`;
    try {
      const source = await Deno.readTextFile(moduleFile);
      const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (
        !new RegExp(`(?:Функция|Процедура)\\s+${escaped}\\s*\\(`).test(source)
      ) {
        errors.push(`Missing target API ${module}.${symbol} in ${moduleFile}`);
      }
    } catch (error) {
      errors.push(`Missing target module ${moduleFile}: ${error}`);
    }
  }
}

if (
  snippets.length + migratedSnippets.length + retiredScaffolding.length <
    baselineSnippetCount
) {
  errors.push(
    `Snippet accounting lost content: ${snippets.length} live + ${migratedSnippets.length} migrated + ${retiredScaffolding.length} retired < ${baselineSnippetCount} baseline`,
  );
}

const moduleFiles = await walkFiles(modulesRoot, "/Ext/Module.bsl");
if (moduleFiles.length === 0) errors.push("No common module sources found");
const portableCoreModules = new Set([
  "SharedToolkit_Коллекции",
  "SharedToolkit_JSON",
  "SharedToolkit_Математика",
  "SharedToolkit_Значения",
]);
const forbiddenCoreReferences =
  /\b(?:ОбщегоНазначенияУТ|ОбщегоНазначения|СтандартныеПодсистемы|ДополнительныеОтчетыИОбработки|УправлениеСвойствами|Документы|Справочники|Перечисления|ПланыВидовХарактеристик|РегистрСведений)\s*\./;
const configuration = await Deno.readTextFile(configurationPath);
const invalidMarkers = [/\$\{/, /\$\d/, /``/, /^\s*snippet\s/m, /endsnippet/];
const exportOwners = new Map<string, string[]>();
for (const moduleFile of moduleFiles) {
  const source = await Deno.readTextFile(moduleFile);
  if (source.trim().length === 0) {
    errors.push(`Empty common module: ${moduleFile}`);
  }
  for (const marker of invalidMarkers) {
    if (marker.test(source)) {
      errors.push(`HyperSnips marker ${marker} leaked into ${moduleFile}`);
    }
  }
  if (
    /^\s*Если\s+.*Тогда\s*\r?\n\s*(?:Возврат(?:\s+[^;]+)?|Продолжить|Прервать);\s*\r?\n\s*КонецЕсли;/m
      .test(source)
  ) {
    errors.push(
      `Simple guard control statement must be one line in ${moduleFile}: Если Условие Тогда Возврат/Продолжить/Прервать; КонецЕсли;`,
    );
  }
  if (/ЗначениеЗаполнено\s*\([^\r\n]*\.Найти\s*\(/i.test(source)) {
    errors.push(
      `Результат Найти() в ${moduleFile} нужно сравнивать с Неопределено напрямую, а не проверять через ЗначениеЗаполнено().`,
    );
  }
  const moduleName = moduleFile.slice(modulesRoot.length + 1).split("/")[0];
  if (portableCoreModules.has(moduleName)) {
    if (forbiddenCoreReferences.test(source)) {
      errors.push(
        `Portable core module ${moduleName} references configuration/BSP metadata or APIs`,
      );
    }
    for (
      const match of source.matchAll(
        /\b(SharedToolkit_[А-Яа-яЁёA-Za-z0-9_]+)\s*\./g,
      )
    ) {
      if (!portableCoreModules.has(match[1])) {
        errors.push(
          `Portable core module ${moduleName} depends on adapter ${match[1]}`,
        );
      }
    }
  }
  const moduleMetadata = await Deno.readTextFile(
    `${modulesRoot}/${moduleName}.xml`,
  );
  if (!/<Global>false<\/Global>/.test(moduleMetadata)) {
    errors.push(
      `SharedToolkit common module ${moduleName} must be non-global: server-capable global common modules are invalid in 1C extensions`,
    );
  }
  for (const symbol of exportedBslSymbols(source)) {
    exportOwners.set(symbol, [
      ...(exportOwners.get(symbol) ?? []),
      moduleName,
    ]);
  }
  if (!moduleName.startsWith("SharedToolkit_")) {
    errors.push(
      `Common module ${moduleName} violates naming convention: expected SharedToolkit_<Name>`,
    );
  }
  if (!configuration.includes(`<CommonModule>${moduleName}</CommonModule>`)) {
    errors.push(
      `Common module ${moduleName} is not registered in Configuration.xml`,
    );
  }
}

for (const [symbol, owners] of exportOwners) {
  if (owners.length > 1) {
    errors.push(
      `Duplicate SharedToolkit exported API ${symbol}: ${
        owners.join(", ")
      }; exported names stay unique so onec meta can qualify cross-module calls deterministically`,
    );
  }
}

if (errors.length > 0) {
  throw new Error(
    `Snippet migration verification failed:\n${errors.join("\n")}`,
  );
}

const migratedRows = migratedSnippets.map((record) =>
  `| \`${record.file}\` | \`${record.trigger}\` | \`${record.target}\` |`
).join("\n");
const templateRows = snippets.map((snippet) =>
  `| \`${snippet.file}\` | \`${snippet.trigger}\` | ${
    templateReason(snippet)
  } |`
).join("\n");

const markdown = `# HyperSnips → SharedToolkit migration inventory

Checked by \`deno run -A tools/verify_snippet_migration.ts\`; this command never writes the inventory.

## Policy

Only behavior that is naturally reusable as a standalone parameterized function/procedure is removed from HyperSnips and moved to SharedToolkit. Runtime helpers must add useful semantics, policy, validation, composition, or non-trivial reusable behavior; wrappers that only rename an already-clear 1C API remain snippets. Short helpers may still belong in SharedToolkit when their name materially improves intent. Event handlers, callbacks, platform-required entry points, control-flow skeletons, preprocessor/query fragments, and editor shortcuts remain snippets. SharedToolkit targets platform 8.3.27 by default and keeps all owned common modules non-global for a uniform cross-version API; 8.3.27 rejects global server common modules in extensions, while platform 8.5.4+ supports them. Calls from another module use the explicit \`SharedToolkit_Модуль.Метод(...)\` form; calls to procedures/functions declared in the current module may remain unqualified.

- Original inventory before migration: **${baselineSnippetCount}** snippets
- Runtime snippets removed from HyperSnips: **${migratedSnippets.length}**
- Dead demo/test scaffolding retired from HyperSnips: **${retiredScaffolding.length}**
- Templates/shortcuts remaining in HyperSnips: **${snippets.length}**
- SharedToolkit common modules validated: **${moduleFiles.length}**
- HyperSnips source: \`${snippetsDisplayRoot}\`

## Migrated runtime helpers

| Original file | Removed trigger | SharedToolkit API |
|---|---|---|
${migratedRows}

## Retired demo/test scaffolding

${retiredScaffolding.map((value) => `- \`${value}\``).join("\n")}

## Remaining HyperSnips templates

| File | Trigger | Why it remains a snippet |
|---|---|---|
${templateRows}
`;
const checkedInInventory = await Deno.readTextFile(inventoryPath);
if (checkedInInventory !== markdown) {
  throw new Error(
    `Migration inventory is stale: ${inventoryPath}. Review and edit the inventory explicitly, then rerun this check.`,
  );
}

console.log(JSON.stringify(
  {
    baselineSnippets: baselineSnippetCount,
    migratedRuntimeSnippets: migratedSnippets.length,
    remainingTemplateSnippets: snippets.length,
    commonModules: moduleFiles.length,
    inventory: inventoryPath,
  },
  null,
  2,
));
