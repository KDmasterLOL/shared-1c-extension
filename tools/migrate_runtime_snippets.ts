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
const apply = Deno.args.includes("--apply");

interface ProposedFile {
  path: string;
  relative: string;
  original: string;
  updated: string;
  removed: string[];
  deleteFile: boolean;
}

async function walkFiles(root: string): Promise<string[]> {
  const result: string[] = [];
  async function walk(dir: string) {
    for await (const entry of Deno.readDir(dir)) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory) await walk(path);
      else if (entry.isFile && path.endsWith(".hsnips")) result.push(path);
    }
  }
  await walk(root);
  return result.sort();
}

function normalizeBrokenBoundaries(text: string): string {
  return text
    .replaceAll("endsnippetsnippet", "endsnippet\nsnippet")
    .replaceAll("endsnippetglobal", "endsnippet\nglobal");
}

function removeMigratedBlocks(relative: string, source: string): {
  text: string;
  removed: string[];
} {
  const lines = normalizeBrokenBoundaries(source).split("\n");
  const output: string[] = [];
  const removed: string[] = [];

  for (let index = 0; index < lines.length;) {
    const match = lines[index].match(/^\s*snippet\s+(\S+)\s+"[^"]*"/);
    if (!match) {
      output.push(lines[index]);
      index += 1;
      continue;
    }

    const trigger = match[1];
    const block: string[] = [lines[index]];
    index += 1;
    while (index < lines.length) {
      block.push(lines[index]);
      const done = /^\s*endsnippet\s*$/.test(lines[index]);
      index += 1;
      if (done) break;
    }

    if (migratedKeys.has(migrationKey(relative, trigger))) {
      removed.push(trigger);
      while (
        index < lines.length && lines[index].trim() === "" &&
        output.at(-1)?.trim() === ""
      ) {
        index += 1;
      }
      continue;
    }

    output.push(...block);
  }

  let text = output.join("\n");

  if (relative === "journaling.hsnips" && removed.length > 0) {
    text = "";
  }
  if (relative === "external_data_proccesor/external_data_proccesor.hsnips") {
    text = text.replace(
      /global\s*\n[\s\S]*?let\s+ТипыКоманд\s*=\s*\[[^\n]*\];\s*\nendglobal\s*\n*/m,
      "",
    );
    text = text.replace(
      `#Область СлужебныеПроцедурыИФункции\n\`\`invokeSnippet("Функция.ЗафиксироватьВЖурналеРегистрации", [])\`\`\n#КонецОбласти\n\n`,
      "",
    );
  }
  if (relative === "external_data_proccesor/functions.hsnips") {
    text = text.replace(/^\s*let\s+ТипыКоманд\s*=\s*\[[^\n]*\];\s*\n/m, "");
    text = text.replace(
      `\t\`\`invokeSnippet("ДобавитьКомандуВнешнейОбработки", [])\`\`\n`,
      `\tSharedToolkitВнешниеОбработкиСервер.ДобавитьКоманду(\n\t\tПараметрыРегистрации,\n\t\t"\${5:ИдентификаторКоманды}",\n\t\tНСтр("ru = '\${6:ПредставлениеКоманды}'"),\n\t\tДополнительныеОтчетыИОбработкиКлиентСервер.ТипКоманды\${7|ВызовКлиентскогоМетода,ВызовСерверногоМетода,ЗагрузкаДанныхИзФайла,ЗаполнениеФормы,ОткрытиеФормы|}(),\n\t\t\${8|Ложь,Истина|},\n\t\t"\${9:Модификатор}"\n\t);\n`,
    );
  }

  text = text.replace(/^\s*\n/, "").replace(/\n{3,}/g, "\n\n");
  if (text.length > 0 && !text.endsWith("\n")) text += "\n";
  return { text, removed };
}

async function removeEmptyDirectories(root: string): Promise<void> {
  const dirs: string[] = [];
  async function collect(dir: string) {
    for await (const entry of Deno.readDir(dir)) {
      if (!entry.isDirectory) continue;
      const path = `${dir}/${entry.name}`;
      await collect(path);
      dirs.push(path);
    }
  }
  await collect(root);
  for (const dir of dirs) {
    let hasEntries = false;
    for await (const _entry of Deno.readDir(dir)) {
      hasEntries = true;
      break;
    }
    if (!hasEntries) await Deno.remove(dir);
  }
}

const migratedKeys = new Set(
  migratedSnippets.map((record) => migrationKey(record.file, record.trigger)),
);
const found = new Map<string, number>();
const proposals: ProposedFile[] = [];

for (const path of await walkFiles(snippetsRoot)) {
  const relative = path.slice(snippetsRoot.length + 1);
  const original = await Deno.readTextFile(path);
  const { text: updated, removed } = removeMigratedBlocks(relative, original);
  for (const trigger of removed) {
    const key = migrationKey(relative, trigger);
    found.set(key, (found.get(key) ?? 0) + 1);
  }

  if (removed.length === 0) continue;
  const deleteFile = updated.trim().length === 0;
  proposals.push({ path, relative, original, updated, removed, deleteFile });
}

const errors: string[] = [];
for (const record of migratedSnippets) {
  const count = found.get(migrationKey(record.file, record.trigger)) ?? 0;
  if (count !== 1) {
    errors.push(
      `${record.file} :: ${record.trigger}: expected once, found ${count}`,
    );
  }
}
if (errors.length > 0) {
  throw new Error(
    `Migration plan does not match live HyperSnips:\n${errors.join("\n")}`,
  );
}

console.log(JSON.stringify(
  {
    mode: apply ? "apply" : "dry-run",
    snippetsToRemove: migratedSnippets.length,
    filesChanged: proposals.length,
    filesDeleted: proposals.filter((proposal) => proposal.deleteFile).map((
      proposal,
    ) => proposal.relative),
    changes: proposals.map((proposal) => ({
      file: proposal.relative,
      removed: proposal.removed,
      deleteFile: proposal.deleteFile,
    })),
  },
  null,
  2,
));

if (apply) {
  for (const proposal of proposals) {
    if (proposal.deleteFile) await Deno.remove(proposal.path);
    else await Deno.writeTextFile(proposal.path, proposal.updated);
  }
  await removeEmptyDirectories(snippetsRoot);
}
