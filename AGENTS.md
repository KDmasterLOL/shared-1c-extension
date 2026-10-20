# DOX framework

- DOX is highly performant AGENTS.md hierarchy installed here
- Agent must follow DOX instructions across any edits

## Core Contract

- AGENTS.md files are binding work contracts for their subtrees
- Work products, source materials, instructions, records, assets, and durable docs must stay understandable from the nearest applicable AGENTS.md plus every parent AGENTS.md above it

## Read Before Editing

1. Read the root AGENTS.md
2. Identify every file or folder you expect to touch
3. Walk from the repository root to each target path
4. Read every AGENTS.md found along each route
5. If a parent AGENTS.md lists a child AGENTS.md whose scope contains the path, read that child and continue from there
6. Use the nearest AGENTS.md as the local contract and parent docs for repo-wide rules
7. If docs conflict, the closer doc controls local work details, but no child doc may weaken DOX

Do not rely on memory. Re-read the applicable DOX chain in the current session before editing.

## Update After Editing

Every meaningful change requires a DOX pass before the task is done.

Update the closest owning AGENTS.md when a change affects:

- purpose, scope, ownership, or responsibilities
- durable structure, contracts, workflows, or operating rules
- required inputs, outputs, permissions, constraints, side effects, or artifacts
- user preferences about behavior, communication, process, organization, or quality
- AGENTS.md creation, deletion, move, rename, or index contents

Update parent docs when parent-level structure, ownership, workflow, or child index changes. Update child docs when parent changes alter local rules. Remove stale or contradictory text immediately. Small edits that do not change behavior or contracts may leave docs unchanged, but the DOX pass still must happen.

## Hierarchy

- Root AGENTS.md is the DOX rail: project-wide instructions, global preferences, durable workflow rules, and the top-level Child DOX Index
- Child AGENTS.md files own domain-specific instructions and their own Child DOX Index
- Each parent explains what its direct children cover and what stays owned by the parent
- The closer a doc is to the work, the more specific and practical it must be

## Child Doc Shape

- Create a child AGENTS.md when a folder becomes a durable boundary with its own purpose, rules, responsibilities, workflow, materials, or quality standards
- Work Guidance must reflect the current standards of the project or user instructions; if there are no specific standards or instructions yet, leave it empty
- Verification must reflect an existing check; if no verification framework exists yet, leave it empty and update it when one exists

Default section order:
- Purpose
- Ownership
- Local Contracts
- Work Guidance
- Verification
- Child DOX Index

## Style

- Keep docs concise, current, and operational
- Document stable contracts, not diary entries
- Put broad rules in parent docs and concrete details in child docs
- Prefer direct bullets with explicit names
- Do not duplicate rules across many files unless each scope needs a local version
- Delete stale notes instead of explaining history
- Trim obvious statements, repeated rules, misplaced detail, and warnings for risks that no longer exist

## Closeout

1. Re-check changed paths against the DOX chain
2. Update nearest owning docs and any affected parents or children
3. Refresh every affected Child DOX Index
4. Remove stale or contradictory text
5. Run existing verification when relevant
6. Report any docs intentionally left unchanged and why

## User Preferences

When the user requests a durable behavior change, record it here or in the relevant child AGENTS.md

## Child DOX Index

- No child AGENTS.md files are needed for the current repository structure.
- Root-owned files: `README.md`, `LICENSE`, `banner.jpg`, `video-thumbnail.jpg`, and root-level project documentation.

# Shared 1C Extension

## Purpose

This repository is the canonical source tree for reusable personal 1C:Enterprise metadata: common modules, processors, and related objects intended to be moved between configurations.

## Tool boundary

- Do not add `onec-metadata` as a Rust dependency.
- Use the installed canonical `onec meta` CLI for metadata inspection, initialization, retargeting, common-module creation/update, validation, and structural BSL qualification; do not invoke removed `onec-meta` binaries or handwrite structural metadata XML.
- Use `onec meta create-common-module` to register a new common module and create its `Ext/Module.bsl` source tree; use `onec meta update-common-module` for common-module metadata flags.
- Every extension-owned common module must be named `SharedToolkit_<Name>`; the root extension remains `SharedToolkit` and adopted base metadata such as `Language.Русский` keeps its base name.
- SharedToolkit currently targets platform 8.3.27 by default (`ONEC_TARGET_PLATFORM` may override verification). All extension-owned `SharedToolkit_*` common modules therefore remain non-global (`Global = false`) for one uniform API contract; 8.3.27 rejects global server common modules in extensions, while 8.5.4+ supports them. Calls from another module must be explicit (`SharedToolkit_Коллекции.СоздатьТаблицуЗначений(...)`); procedures/functions declared in the current module may be called directly.
- Keep exported names unique across SharedToolkit so `onec meta qualify-common-module-calls` can resolve ownership deterministically. `onec meta validate` must pass and detect both invalid extension common-module flags and remaining unqualified cross-module calls without mutating source files.
- Retarget an existing extension to another base dump through `onec meta retarget-extension`; preserve SharedToolkit-owned UUIDs/BSL while updating XML format and existing adopted-object mappings. Do not hand-edit base UUID mappings.
- Project `just add-*-module` recipes accept a suffix and add `SharedToolkit_` automatically.
- Metadata-object renames must go through `onec meta rename-object`; do not hand-rename XML files/directories or only edit `<Properties><Name>`.

## Public repository

- Source code is MIT-licensed; the canonical license notice is in `LICENSE`.
- Do not commit hard-coded personal/home paths, credentials, private metadata, or author/date comment markers. Runtime tooling resolves the snippets directory via `HSNIPS_BSL_ROOT` or `$HOME`.
- Preserve meaningful BSL contract comments and public API documentation; do not strip explanatory comments solely to remove historical author markers.
- Before publication, verify all reachable commits of the proposed public branch, not only its working tree. Historical internal commits must not be exposed simply by pushing `dev`.

## Source layout

- `src/` is the Designer hierarchical XML extension source tree.
- Keep reusable metadata inside `src/`.
- Do not commit packed `.cfe` build outputs into the source tree.
- Base-configuration mappings are configuration-specific. Do not silently reuse a mapping when targeting another configuration.

## BSL architecture and quality

- Before a non-trivial change, inspect the owning module, callers, data contract, target execution context, and applicable metadata. For platform behavior, BSP APIs, extension capabilities, transactions, client/server behavior, security, and performance, verify against current official 1C standards/documentation and applicable BSL Language Server/EDT diagnostics rather than relying on memory.
- Distinguish an official 1C requirement, an official recommendation, a SharedToolkit project convention, and an engineering inference. When they differ, document the reason and preserve the project-specific exception explicitly.
- Each `SharedToolkit_*` module must own one coherent responsibility. Do not create catch-all modules such as `Общее`, `Разное`, or numbered utility modules. If functionality changes for a different reason, it should normally have a different owner.
- Generic modules (`Коллекции`, `Значения`, `JSON`, `Математика`, etc.) must not acquire hidden BSP/UT/KA/application-metadata dependencies. Configuration-specific modules may depend on generic modules; generic modules must not depend back on configuration-specific modules.
- Keep the public API small and semantic. Prefer one exported operation that represents a concept plus private type-specific specializations over families of nearly identical exported methods. Do not merge operations whose business semantics differ merely to reduce API size.
- Procedures/functions are private by default. `Экспорт` is a durable contract and must exist only when another module needs the method. Public exports belong in `ПрограммныйИнтерфейс` and require useful contract documentation; internal implementation remains private whenever possible.
- Do not add wrappers that only rename an obvious 1C/BSP API. A helper must add domain meaning, validation, policy, compatibility, composition, error semantics, or isolation of non-obvious implementation details.
- Keep each method at one abstraction level and one meaningful responsibility. Large methods, deep nesting, high cognitive complexity, mixed UI/data/calculation/write responsibilities, or many unrelated side effects are refactoring signals; split by semantic steps, not mechanically by line count.
- Follow the 1C parameter guideline: target roughly no more than 7 parameters and no more than 3 optional parameters. For many related options, use a `Структура`/`ФиксированнаяСтруктура` parameter with an explicit constructor/default contract rather than a long positional signature. Do not replace clear small signatures with structures only for uniformity.
- Distinguish an omitted option from valid `Ложь`, `0`, and `""`. Where `Неопределено` means “not supplied”, compare to `Неопределено` rather than using `ЗначениеЗаполнено()`.
- Validate external/public contracts at the boundary, then rely on established invariants internally. Do not repeat the same defensive check through every private layer and do not add checks that merely hide corrupt data.
- Prefer guard clauses when they make the main path linear. Combine guards only when they express the same semantic reason, have the same exit, are side-effect-free, preserve short-circuit semantics, and are clearer together; separate guards are valid when reasons or intermediate computations differ.
- Side effects must be obvious from method names and documentation. `Получить*`, `Найти*`, `Проверить*`, and predicate-style methods must not unexpectedly write data, delete objects, launch processes, or call external services.
- Treat errors as part of the API contract: distinguish fatal failure, documented alternative result, per-item batch failure, and cleanup failure. Never catch an unknown exception only to return `Неопределено`/`Ложь`. Batch operations may log an item failure and continue only when partial success is intentional and represented in the returned result.
- Explicit transactions have one owner and the minimum possible scope. `НачатьТранзакцию()` and commit/rollback stay in the same method; commit is the final action in `Попытка`; rollback happens before further exception handling; external resources must not be called while the transaction is open unless the business invariant genuinely requires it.
- Privileged execution is a security boundary. Keep privileged operations server-only, narrowly scoped, input-validated, and separated from generic APIs. Do not enable privileged mode simply to bypass access errors.
- `Выполнить()` is exceptional. It is permitted for current closed internal dispatchers only when the executable target comes exclusively from a hard-coded map controlled by the module. Never build executable BSL from user input, database text, HTTP/JSON, or arbitrary settings. The existing `SharedToolkit_Коллекции.ФильтроватьКолонки` string-filter contract is a documented exception: its BSL expression must be trusted developer-authored code and must not contain external or persisted input.
- `SharedToolkit_Интеграция.ВыполнитьPython` starts an operating-system process on the server. Its executable and script paths must be trusted developer/admin-controlled values; never pass paths from user input, database records, settings, or external requests. The function validates nonempty string arguments but cannot prove their provenance.
- Keep client/server transitions explicit and coarse-grained. Do not call the server or execute a query once per collection item when the operation can be batched. Avoid transferring unnecessary form/data context.
- A query that needs only a bounded subset should limit and deterministically order that subset. `ПЕРВЫЕ N` is not a blanket requirement for all queries. Avoid N+1 queries and unnecessary object loads; use set-oriented data access where practical.
- Do not add caching merely because a value is reused. Cache only established expensive/stable work when the key, lifetime, and invalidation semantics are clear.
- Every temporary file, temporary-storage value, external process, or similar resource needs an explicit lifecycle owner. Cleanup failures may be logged separately when they must not replace an already valid primary result.
- Reusable business logic must be callable and testable without manual form interaction. Form/event code should orchestrate UI and delegate reusable behavior.
- For each discovered bug, identify the violated invariant and add a regression test, validator rule, or reproducible runtime smoke check when feasible. Do not fix only the observed input if the bug class can recur.

## HyperSnips

The project uses the central HyperSnips tree directly. Tooling accepts `HSNIPS_BSL_ROOT`; otherwise it joins `$HOME` with the standard path and errors if `HOME` is unavailable:

`$HOME/.config/Code/User/hsnips`

1C snippets live under `bsl/`. HyperSnips is the canonical home only for code-generation/editor templates; SharedToolkit is the canonical home for reusable runtime functions and procedures.

Migration rules:

- checkpoint the HyperSnips git repository before destructive migration;
- move only behavior that is naturally a standalone parameterized exported procedure/function;
- after its SharedToolkit API is verified, remove the duplicated runtime snippet from HyperSnips;
- keep form event handlers, callbacks, platform-required object/form entry points, control-flow/query skeletons, preprocessor templates, completion shortcuts, and HyperSnips interpolation as snippets;
- do not create trivial common-module wrappers around already-clear native 1C APIs merely to eliminate a useful editor shortcut; short helpers are still valid when their name adds material domain semantics or hides non-obvious implementation details;
- never copy `${...}`, `$1`, `$0`, interpolation backticks, `snippet`, or `endsnippet` into runtime BSL;
- remaining snippets must not `invokeSnippet(...)` a migrated/deleted trigger;
- keep generic modules separate from configuration-specific dependencies (`БСП`, `УТ`/`КА`, GTD, counterparties, document metadata);
- переиспользуемые операции формирования `ТаблицаЗначений` хранить в `SharedToolkit_Коллекции` в области `ТаблицыЗначений`; преобразования между типами выполнять через одну экспортную `SharedToolkit_Коллекции.ПреобразоватьВ(ИсходноеЗнч, ТипРезультата, Параметры = Неопределено)` в области `Преобразование`, а не через экспортные функции для каждой пары типов вроде `ТаблицаЗначенийИзМассиваСтруктур` или `ТаблицаЗначенийИзКлючейИЗначений`; сложные преобразования сейчас поддерживают `Массив`/`ФиксированныйМассив` структур -> `ТаблицаЗначений`, коллекции ключ-значение -> `ТаблицаЗначений` и `ТаблицаЗначений` -> `Массив` структур; остальные преобразования передавать штатному `ОписаниеТипов.ПривестиЗначение()`; `ДобавитьКолонки()` должна сводить каждое поддерживаемое описание колонки к `ИмяКолонки`, `ТипКолонки`, `ЗаголовокКолонки`, `ШиринаКолонки` и выполнять один общий вызов `Таблица.Колонки.Добавить(...)`; не создавать отдельную служебную `ДобавитьКолонку()` и не дублировать добавление по веткам типов; произвольные имена колонок приводить через `Строка(...)`, обрезать пробелы и пропускать пустой результат;
- для чтения значения из `Структура`, `ФиксированнаяСтруктура`, `Соответствие` и `ФиксированноеСоответствие` использовать одну экспортную `SharedToolkit_Коллекции.ПолучитьИзКоллекции(Коллекция, Ключ, ЗначениеПоУмолчанию = Неопределено, ОжидаемыйТип = Неопределено)`; не создавать отдельные аналоги вроде `ПолучитьПоле`, `ПолучитьПараметр` или типоспецифичных функций для настроек; `Неопределено` вместо коллекции трактуется как отсутствие ключа; четвертый параметр принимает `Тип` или `ОписаниеТипов`, а преобразование результата выполняется через `SharedToolkit_Коллекции.ПреобразоватьВ()` при межмодульном вызове или напрямую внутри того же модуля;
- проверку принадлежности выполнять через одну экспортную `SharedToolkit_Коллекции.Содержит(Коллекция, Элемент, РежимПоиска = Неопределено)` в функциональной области `Содержит`; диспетчеризация строится через `Соответствие` типа коллекции и суффикса служебной специализации с одним вызовом через `Выполнить()`; для `Массив`/`ФиксированныйМассив` и `СписокЗначений` проверяется значение, для `ТаблицаЗначений` — принадлежность строки таблице, для `ДеревоЗначений` — принадлежность строки дереву на любой глубине; для `Структура`/`ФиксированнаяСтруктура` и `Соответствие`/`ФиксированноеСоответствие` по умолчанию проверяется ключ, а `РежимПоиска = "Знч"` ищет среди значений; явный `РежимПоиска = "Ключ"` эквивалентен поведению по умолчанию; режим поиска запрещен для коллекций без неоднозначности ключ/значение; не создавать отдельные функции вроде `МассивСодержитЗначение` или `СоответствиеСодержитКлюч`;
- объединение коллекций использует одну экспортную процедуру `SharedToolkit_Коллекции.Объединить(Приемник, Источник, Параметры = Неопределено)` в области `Объединить`; тип приёмника сопоставляется с суффиксом служебной специализации через `Соответствие`, после чего `Объединить<Суффикс>(...)` вызывается один раз через `Выполнить()` без цепочки `Если/ИначеЕсли`; передавать `Параметры` в специализацию как есть и не создавать промежуточную пустую структуру/функцию нормализации: `ПолучитьИзКоллекции()` уже трактует `Неопределено` как отсутствие ключей и возвращает заданное значение по умолчанию; специализации `ОбъединитьМассивы`, `ОбъединитьСтруктуры`, `ОбъединитьСоответствия`, `ОбъединитьСпискиЗначений`, `ОбъединитьТаблицыЗначений`, `ОбъединитьДеревьяЗначений` остаются служебными; третий аргумент — `Неопределено`, `Структура` или `ФиксированнаяСтруктура` с настройками конкретной специализации: для массивов и списков значений `ТолькоУникальные`, для структур и соответствий `ПерезаписыватьСуществующие`, для таблиц и деревьев значений `ДобавлятьНедостающиеКолонки`; каждая специализация читает только нужные ей настройки, а присутствующее значение проверяется по ожидаемому типу;
- for this compact personal toolkit, related client and server APIs may share one common module when the module is non-privileged; mark every context-specific exported method explicitly with `&НаКлиенте` or `&НаСервере` and keep privileged operations in separate server-only modules;
- this mixed-module convention is a deliberate project-specific exception to the standard 1C recommendation to split differing client/server business logic into separate common modules;
- follow the standard 1C common-module region structure: public exported APIs belong in `#Область ПрограммныйИнтерфейс`; internal non-exported implementation belongs in `#Область СлужебныеПроцедурыИФункции`; use `#Область СлужебныйПрограммныйИнтерфейс` only for exported APIs intentionally restricted to other objects of the same functional subsystem, and do not create empty regions;
- when a top-level region becomes large, group logically related methods into nested functional subregions (for example `#Область ОбъектВСтроку` inside `СлужебныеПроцедурыИФункции`); subregions must reflect functionality rather than client/server context and must not mix public API with private implementation;
- when checking whether one value belongs to two or more possible types, use `SharedToolkit_Значения.ЗначениеОдногоИзТипов(Значение, ДопустимыеТипы)` from another module instead of repeating `ТипЗнч(...) = Тип(...)` with `ИЛИ`; inside `SharedToolkit_Значения` itself the call may remain unqualified; prefer a comma-separated type string for static type sets and `ОписаниеТипов` when it is already available;
- для результатов `Найти()` и аналогичных методов, где `Неопределено` однозначно означает «не найдено», сравнивать результат напрямую с `Неопределено`; это предпочтительнее `ЗначениеЗаполнено()`, особенно когда корректным результатом может быть индекс `0`; `ЗначениеЗаполнено()` использовать для смысловой проверки заполненности обычных значений, а `ЗначениеЗаполненоРасширенно()` — когда значение может быть произвольным или изменяемым платформенным типом;
- `ЗначениеЗаполненоРасширенно()` must remain client/server-safe: explicitly dispatch known collection/specialized types, protect server/thick-client-only types with preprocessor context checks, then fall back to platform `ЗначениеЗаполнено()`; do not probe for method/property availability through `Попытка/Исключение`; an existing opaque mutable object is treated as filled only when the platform has no canonical empty-state semantics;
- use `SharedToolkit_Значения.ОбъектВСтроку()` from another module for human-readable diagnostics/logging of arbitrary values and nested collections; do not add type-specific string helpers such as `МассивВСтроку()` when `ОбъектВСтроку()` already covers that type and formatting need; keep it client/server-safe, bounded by depth/item limits, and never treat its output as a serialization format or parse it back into business data;
- for repeated conditional assignment with filledness semantics, prefer `SharedToolkit_Значения.ПрисвоитьЕслиЗаполнено(Приемник, Источник)` from another module; its first parameter is intentionally passed by reference, its second by value, and validation goes through `ЗначениеЗаполненоРасширенно()`;
- сравнения с числовыми значениями и кодами состояния, например код возврата процесса `<> 0`, остаются допустимыми; `Неопределено` можно использовать как значение параметра по умолчанию, возвращаемое значение, присваиваемое значение и как явный признак отсутствия результата у методов поиска;
- write simple guard clauses whose only body is `Возврат`, `Продолжить`, or `Прервать` on one line: `Если Условие Тогда Возврат; КонецЕсли;`, `Если Условие Тогда Продолжить; КонецЕсли;`, `Если Условие Тогда Прервать; КонецЕсли;`;
- комментировать проверку только тогда, когда существует конкретная неочевидная ситуация выполнения, ради которой она нужна; комментарий должен описывать эту ситуацию и то, что сломается без проверки (например, явно переданное `Ложь` приняли за отсутствующий параметр, существующий ключ `Соответствия` хранит `Неопределено`, выражение фильтра случайно вернуло не `Булево`); не пересказывать в комментарии само условие или механику вызванного метода и не комментировать очевидную проверку;
- в русскоязычных комментариях к BSL и русскоязычной документации использовать русские термины и формулировки; не вставлять английские слова в русский текст, если существует нормальный русский термин; допустимы только точные имена продуктов, команд, путей, типов, методов, свойств и других технических идентификаторов, которые нельзя переводить без потери точности;
- add a source-snippet provenance comment to migrated module code.

The generated inventory is `docs/snippet-migration.md`; `tools/verify_snippet_migration.ts` compares it with the live HyperSnips tree.

## Verification

Run:

```bash
just verify-snippets
just verify
```

`just verify` must run `onec meta inspect`, enforce target-platform and BSL contracts through `onec meta validate --platform-version <target>`, and check the live HyperSnips migration inventory without rewriting it. The default target is 8.3.27; override it only intentionally with `ONEC_TARGET_PLATFORM`. `just capabilities` prints the capability matrix for that target. `just retarget-base <base>` structurally refreshes the extension against a real base dump; `just qualify-calls` applies the ownership analysis used by validation. This repository has no `onec-project.toml`, so `onec project` project-target and YAxUnit workflows are not configured here. Runtime acceptance requires a separately selected isolated test infobase; never target production for smoke checks.

For human inspection:

```bash
just inspect
```

Initialization must fail rather than overwrite an existing `src/Configuration.xml`.
