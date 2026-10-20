# Shared 1C Extension

Reusable 1C:Enterprise extension for common modules, data processors, and other metadata that should be movable between configurations.

## Current state

The extension source tree is initialized as:

- metadata name: `SharedToolkit`;
- synonym: `Общий набор инструментов`;
- purpose: `AddOn`;
- source format: Designer hierarchical XML `2.20`;
- current adopted-object mapping target: `Управление торговлей 11.6.1.53`;
- source root: `src/`.

The extension contains **16 non-global common-module metadata objects** generated and maintained structurally through `onec meta`. Every extension-owned module follows the explicit `SharedToolkit_<Name>` convention (for example `SharedToolkit_JSON` and `SharedToolkit_Формы`), and calls from another module use the explicit `SharedToolkit_<Module>.<Method>(...)` form. The root extension itself remains `SharedToolkit`, while adopted base metadata such as `Language.Русский` keeps its base name. SharedToolkit currently targets platform **8.3.27** by default, where global server common modules are not supported inside extensions; platform 8.5.4+ adds that capability, but this project keeps all SharedToolkit modules non-global for one consistent cross-version API. For the compact personal-toolkit API, related client and server methods may live in one common module and are explicitly marked with `&НаКлиенте` / `&НаСервере`; privileged code remains isolated in dedicated server-only modules.

`SharedToolkit_Коллекции` exposes `SharedToolkit_Коллекции.Объединить(Приемник, Источник, Параметры = Неопределено)` for mutable collections. It dispatches by receiver type to private specializations for `Массив`, `Структура`, `Соответствие`, `СписокЗначений`, `ТаблицаЗначений`, and `ДеревоЗначений`; fixed arrays/structures/maps are supported as read-only sources where applicable. The optional `Структура`/`ФиксированнаяСтруктура` carries specialization-specific options: `ТолькоУникальные` for arrays/value lists, `ПерезаписыватьСуществующие` for structures/maps, and `ДобавлятьНедостающиеКолонки` for value tables/trees. Each specialization reads its own options and validates the value type when an option is present; explicitly supplied `Ложь` is preserved. Table/tree merging adds missing columns by default, while key-value merging overwrites matching keys by default.

Examples:

```bsl
SharedToolkit_Коллекции.Объединить(Массив1, Массив2, Новый Структура("ТолькоУникальные", Истина));
SharedToolkit_Коллекции.Объединить(Структура1, Структура2, Новый Структура("ПерезаписыватьСуществующие", Ложь));
SharedToolkit_Коллекции.Объединить(Таблица1, Таблица2, Новый Структура("ДобавлятьНедостающиеКолонки", Ложь));
```

The migration started from **97** HyperSnips declarations under `$HOME/.config/Code/User/hsnips/bsl`. **33** standalone runtime helpers are currently moved to SharedToolkit, **61** editor templates/shortcuts remain in HyperSnips, and **3** dead demo/test snippets were retired. Set `HSNIPS_BSL_ROOT` to use a different live snippet directory. A helper is migrated only when it adds reusable semantics, policy, validation, composition, or otherwise non-trivial behavior. Thin aliases around already-clear 1C APIs stay as snippets; short helpers can still belong in SharedToolkit when the helper name materially improves intent (for example `Модуль()`).

See [`docs/snippet-migration.md`](docs/snippet-migration.md) for the generated per-snippet inventory.

## Безопасность исполняемых API

Некоторые функции выполняют код или запускают процессы, поэтому их следует вызывать только с доверенными источниками:

- `SharedToolkit_Коллекции.ФильтроватьКолонки` принимает строку как выражение BSL. Передавайте только выражения, написанные разработчиком; не используйте пользовательский ввод, данные базы, настройки или ответы внешних служб.
- Внутренние вызовы `Выполнить()` используют только закрытые диспетчеры с целями из заданного в модуле списка. Не формируйте исполняемый текст из пользовательских, сохранённых или внешних данных.
- `SharedToolkit_Интеграция.ВыполнитьPython` запускает процесс от имени сервера. Исполняемый файл и сценарий должны задаваться разработчиком или администратором. Проверка строкового типа и непустого значения не подтверждает доверенность путей; сценарий сам обязан проверять свои аргументы.

## Проверка исходников

Проект использует установленный объединённый `onec` CLI и не зависит от Cargo crate или соседнего toolkit checkout.

Основные команды:

```bash
just inspect
just capabilities
just retarget-base /path/to/real/base/configuration
just qualify-calls
just verify-snippets
just verify
```

`just verify` запускает `onec meta inspect src`, затем `onec meta validate src --platform-version <целевая версия>` и read-only проверку HyperSnips-инвентаря. Целевая версия по умолчанию — `8.3.27`; осознанное переопределение задаётся через `ONEC_TARGET_PLATFORM`. Structural metadata operations используют `onec meta` напрямую.

Для создания нового дерева используйте реальную выгрузку основной конфигурации Designer:

```bash
just init /path/to/base/configuration
```

`init` выполняется один раз и отказывается перезаписывать существующий `src/Configuration.xml`. Рецепты `just add-*-module` и `just bootstrap-common-modules` используют `onec meta create-common-module`; `just retarget-base` использует `onec meta retarget-extension` и сохраняет UUID модулей SharedToolkit.

`onec meta validate` проверяет Designer XML и ограничения платформы. `onec meta qualify-common-module-calls` / `just qualify-calls` квалифицирует межмодульные вызовы; проверка не переписывает исходники.

В этом дереве нет `onec-project.toml`, поэтому декларативные рабочие процессы `onec project` здесь не применимы. Команды `onec project` предназначены для проектов, в манифесте которых заданы targets, source selections и/или YAxUnit.

## Проверка зависимостей модулей

Публичный API и границы переносимого ядра, платформенных модулей и адаптеров БСП/УТ/КА описаны в [`docs/module-api.md`](docs/module-api.md). Ядро состоит из `SharedToolkit_Значения`, `SharedToolkit_Коллекции`, `SharedToolkit_JSON` и `SharedToolkit_Математика`. Проверка статически запрещает этим модулям прямые ссылки на конфигурационные метаданные, БСП и адаптерные модули.

Статическая проверка не подтверждает наличие конфигурационных метаданных в произвольной целевой базе. Native runtime acceptance требует явно выбранной изолированной тестовой ИБ и отдельного безопасного runtime-процесса; данный набор команд не выбирает и не изменяет информационные базы.

## HyperSnips

The migration tooling reads the live 1C snippet directory from `HSNIPS_BSL_ROOT`, or from `$HOME/.config/Code/User/hsnips/bsl` when that variable is unset. It reports an error if neither setting identifies a location. The inventory records this portable home-relative path and never stores a machine-specific path.

After migration, HyperSnips intentionally contains only template-oriented material, primarily:

- `bsl.hsnips` for directives, transaction/control-flow and small editor templates;
- `helpers.hsnips` for insertion-point/control-flow shortcuts;
- `query.hsnips` for query-language skeletons;
- `form/` for form event handlers, callbacks and module templates;
- `external_data_proccesor/` for required external-processing entry points and context templates;
- `document.creation.hsnips` for the configuration-specific price-document template whose calculation hook cannot be represented as a standalone generic function;
- `macros.hsnips` and `roles.hsnips` for preprocessor/editor shortcuts that still require snippet semantics.

The editor setting in `.vscode/settings.json` points HyperSnips to the standard home-relative directory. Runtime helpers are no longer duplicated there once a standalone SharedToolkit API replaces them.

`tools/verify_snippet_migration.ts` verifies migrated triggers, target APIs, module registration/naming, absence of leaked HyperSnips placeholders, portable-core dependency boundaries, and live `invokeSnippet(...)` references. It compares the computed inventory with `docs/snippet-migration.md` and fails on drift; it never edits documentation or the HyperSnips checkout.

## Structure

```text
shared-1c-extension/
├── .vscode/
│   └── settings.json
├── docs/
│   ├── module-api.md
│   └── snippet-migration.md
├── tools/
│   ├── snippet_migration_plan.ts
│   ├── migrate_runtime_snippets.ts
│   └── verify_snippet_migration.ts
├── src/
│   ├── Configuration.xml
│   ├── Languages/
│   │   └── Русский.xml
│   └── CommonModules/
│       ├── SharedToolkit_Коллекции/
│       ├── SharedToolkit_JSON/
│       ├── SharedToolkit_Математика/
│       ├── SharedToolkit_Значения/
│       ├── SharedToolkit_Формы/
│       ├── SharedToolkit_Файлы/
│       ├── SharedToolkit_ДополнительныеСвойства/
│       ├── SharedToolkit_Пользователи/
│       ├── SharedToolkit_Версионирование/
│       ├── SharedToolkit_ЖурналРегистрации/
│       ├── SharedToolkit_ВнешниеОбработки/
│       ├── SharedToolkit_Интеграция/
│       ├── SharedToolkit_КонтрагентыУТ/
│       ├── SharedToolkit_ДокументыУТ/
│       ├── SharedToolkit_ГТД/
│       └── SharedToolkit_БСП/
├── AGENTS.md
├── README.md
└── justfile
```

Generic helpers are kept separate from BSP- and UT/KA-specific modules so configuration-specific dependencies are explicit. Future reusable 1C metadata belongs under `src/`; packed `.cfe` build outputs do not.

## Лицензия

Распространяется по лицензии [MIT](LICENSE). Copyright © 2026 KDmasterLOL.
