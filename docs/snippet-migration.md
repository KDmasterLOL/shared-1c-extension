# HyperSnips → SharedToolkit migration inventory

Checked by `deno run -A tools/verify_snippet_migration.ts`; this command never writes the inventory.

## Policy

Only behavior that is naturally reusable as a standalone parameterized function/procedure is removed from HyperSnips and moved to SharedToolkit. Runtime helpers must add useful semantics, policy, validation, composition, or non-trivial reusable behavior; wrappers that only rename an already-clear 1C API remain snippets. Short helpers may still belong in SharedToolkit when their name materially improves intent. Event handlers, callbacks, platform-required entry points, control-flow skeletons, preprocessor/query fragments, and editor shortcuts remain snippets. SharedToolkit targets platform 8.3.27 by default and keeps all owned common modules non-global for a uniform cross-version API; 8.3.27 rejects global server common modules in extensions, while platform 8.5.4+ supports them. Calls from another module use the explicit `SharedToolkit_Модуль.Метод(...)` form; calls to procedures/functions declared in the current module may remain unqualified.

- Original inventory before migration: **97** snippets
- Runtime snippets removed from HyperSnips: **33**
- Dead demo/test scaffolding retired from HyperSnips: **3**
- Templates/shortcuts remaining in HyperSnips: **61**
- SharedToolkit common modules validated: **16**
- HyperSnips source: `$HOME/.config/Code/User/hsnips/bsl`

## Migrated runtime helpers

| Original file | Removed trigger | SharedToolkit API |
|---|---|---|
| `bsl.hsnips` | `ЧитатьJSON` | `SharedToolkit_JSON.ПрочитатьJSONИзСтроки` |
| `bsl.hsnips` | `МассивВСтроку` | `SharedToolkit_Значения.ОбъектВСтроку` |
| `bsl.hsnips` | `ОткрытьФормуОбъекта` | `SharedToolkit_Формы.ОткрытьФормуОбъекта` |
| `bsl.hsnips` | `ОткрытьФормуСписка` | `SharedToolkit_Формы.ОткрытьФормуСписка` |
| `bsl.hsnips` | `ВыполнитьPython` | `SharedToolkit_Интеграция.ВыполнитьPython` |
| `bsl.hsnips` | `ЗаполнитьПоСтрокеТЧ` | `SharedToolkit_Интеграция.ЗаполнитьСтрокуXBaseИзСпискаДанных` |
| `bsl.hsnips` | `ПолучитьОбъектПоЗначениюСвойства` | `SharedToolkit_ДополнительныеСвойства.ПолучитьОбъектПоЗначениюСвойства` |
| `bsl.hsnips` | `УстановитьСвойство` | `SharedToolkit_ДополнительныеСвойства.УстановитьСвойство` |
| `bsp/bsp.hsnips` | `Функция.ЗапросВерсийОбъекта` | `SharedToolkit_Версионирование.ЗапросВерсийОбъекта` |
| `bsp/bsp.hsnips` | `Функция.ПрочитатьХранилищеЗначенийИстории` | `SharedToolkit_Версионирование.ПрочитатьВерсиюОбъекта` |
| `document.creation.hsnips` | `Функция.СоздатьТаможеннуюДекларациюИмпортПоJSON` | `SharedToolkit_ГТД.СоздатьТаможеннуюДекларациюИмпортПоJSON` |
| `external_data_proccesor/external_data_proccesor.hsnips` | `ДобавитьКомандуВнешнейОбработки` | `SharedToolkit_ВнешниеОбработки.ДобавитьКоманду` |
| `external_data_proccesor/external_data_proccesor.hsnips` | `ЗапросДополнительныйОтчетИлиОбработка` | `SharedToolkit_ВнешниеОбработки.НайтиДополнительнуюОбработкуПоИмениОбъекта` |
| `external_data_proccesor/external_data_proccesor.hsnips` | `ОткрытьФормуДополнительнойОбработкиБСП` | `SharedToolkit_ВнешниеОбработки.ОткрытьФормуДополнительнойОбработкиБСП` |
| `external_data_proccesor/external_data_proccesor.hsnips` | `ОткрытьФормуДополнительнойОбработки` | `SharedToolkit_ВнешниеОбработки.ПодключитьИОткрытьВнешнююОбработку` |
| `external_data_proccesor/external_data_proccesor.hsnips` | `ПолучитьСсылкуНаДополнительнуюОбработкуПоИмени` | `SharedToolkit_ВнешниеОбработки.НайтиДополнительнуюОбработкуПоИмениОбъекта` |
| `external_data_proccesor/external_data_proccesor.hsnips` | `РаботаСНастройкамиВнешнейОбработки` | `SharedToolkit_ВнешниеОбработки.СохранитьНастройки / ЗагрузитьНастройки` |
| `external_data_proccesor/functions.hsnips` | `Функция.ЗафиксироватьВЖурналеРегистрации` | `SharedToolkit_ЖурналРегистрации.ЗаписатьДляВнешнейОбработки` |
| `external_data_proccesor/functions.hsnips` | `Функция.ПодготовитьДанныеДляДлительнойОперации` | `SharedToolkit_ВнешниеОбработки.ПодготовитьДанныеДляДлительнойОперации` |
| `form/create.element.hsnips` | `(Добавить|Вставить)Элемент` | `SharedToolkit_Формы.СоздатьПолеФормы` |
| `form/create.element.hsnips` | `ПолеВводаПолное` | `SharedToolkit_Формы.СоздатьПолеФормы / НастроитьПолеФормы` |
| `form/helpers.hsnips` | `Процедура.ОбновитьИдентификаторыИзСтаройФормы` | `SharedToolkit_Формы.ОбновитьИдентификаторыИзСтаройФормы` |
| `function.hsnips` | `Функция.Получить` | `SharedToolkit_Коллекции.ПолучитьИзКоллекции` |
| `helpers.hsnips` | `ОткрытьФормуОбщий` | `SharedToolkit_Формы.ОткрытьФормуСПараметрами` |
| `helpers.hsnips` | `Функция.ЭтоКопия` | `SharedToolkit_БСП.ЭтоКопияИнформационнойБазы` |
| `helpers.hsnips` | `МассоваяПометкаНаУдаление` | `SharedToolkit_ДокументыУТ.ПометитьДокументыНаУдаление` |
| `helpers.hsnips` | `ЗаполнитьДопСвойства` | `SharedToolkit_ДополнительныеСвойства.ЗаписатьДополнительноеСвойство` |
| `journaling.hsnips` | `ЗаписьЖурналаРегистрации` | `SharedToolkit_ЖурналРегистрации.Записать` |
| `kontragent.hsnips` | `Процедура.ЗаполнитьЮрАдресКонтрагентаПоИНН` | `SharedToolkit_КонтрагентыУТ.ЗаполнитьЮридическийАдресПоИНН` |
| `math.hsnips` | `Функция.Модуль` | `SharedToolkit_Математика.Модуль` |
| `queries/queries.hsnips` | `ЗапросКонтрагентыСЮрАдресомВСвободнойФорме` | `SharedToolkit_КонтрагентыУТ.ЗапросКонтрагентовСЮридическимАдресомВСвободнойФорме` |
| `roles.hsnips` | `ПользовательВГруппеПользователей` | `SharedToolkit_Пользователи.ПользовательВГруппе` |
| `roles.hsnips` | `ПользовательВГруппеДоступа` | `SharedToolkit_Пользователи.ПользовательВГруппе` |

## Retired demo/test scaffolding

- `bsl.hsnips :: box`
- `bsl.hsnips :: demo`
- `form/command.hsnips :: test`

## Remaining HyperSnips templates

| File | Trigger | Why it remains a snippet |
|---|---|---|
| `bsl.hsnips` | `метки` | template/code-generation snippet |
| `bsl.hsnips` | `НаКлиенте` | editor shortcut; wrapper API would add no abstraction |
| `bsl.hsnips` | `НаСервере` | editor shortcut; wrapper API would add no abstraction |
| `bsl.hsnips` | `Транзакция` | control-flow template with insertion point |
| `document.creation.hsnips` | `Функция.СоздатьДокумент.УстановкаЦенНоменклатуры` | template/code-generation snippet |
| `external_data_processor/external_data_proccesor.hsnips` | `МодульОбъектаВнешнейОбработки` | template/code-generation snippet |
| `external_data_processor/external_data_proccesor.hsnips` | `МодульОбъектаФормыВнешнейОбработки` | template/code-generation snippet |
| `external_data_processor/external_data_proccesor.hsnips` | `ПолучитьСсылкуНаДополнительнуюОбработкуПриСозданииНаСервере` | template/code-generation snippet |
| `external_data_processor/functions.hsnips` | `Процедура.ВызватьПроцедуруИлиФункциюВнешнейОбработки` | template/code-generation snippet |
| `external_data_processor/functions.hsnips` | `Функция.ВыполнитьКомандуВнешнейОбработки` | template/code-generation snippet |
| `external_data_processor/functions.hsnips` | `Функция.ИмяФайлаОбработки` | template/code-generation snippet |
| `external_data_processor/functions.hsnips` | `Функция.НаименованиеОбработки` | template/code-generation snippet |
| `external_data_processor/functions.hsnips` | `Функция.СведенияОВнешнейОбработке` | template/code-generation snippet |
| `form/command.hsnips` | `ВыборФайла` | form handler/callback/template context |
| `form/command.hsnips` | `ЗагрузитьФайл` | form handler/callback/template context |
| `form/command.hsnips` | `Команда` | form handler/callback/template context |
| `form/command.hsnips` | `Команда.ПоказатьВводСтроки` | form handler/callback/template context |
| `form/command.hsnips` | `ОткрытьВыбор` | form handler/callback/template context |
| `form/element.event.hsnips` | `СобытиеЭлементаФормы.ОбработкаВыбора` | form handler/callback/template context |
| `form/event.hsnips` | `ОбработкаОповещения` | form handler/callback/template context |
| `form/event.hsnips` | `ПередЗагрузкойДанныхИзНастроекНаСервере` | form handler/callback/template context |
| `form/event.hsnips` | `ПриЗагрузкеДанныхИзНастроекНаСервере` | form handler/callback/template context |
| `form/event.hsnips` | `ПриСохраненииДанныхВНастройкахНаСервере` | form handler/callback/template context |
| `form/event.hsnips` | `ПроверкаЗаполненияНаСервере` | form handler/callback/template context |
| `form/event.hsnips` | `СобытиеФормы.ОбработкаВыбора` | form handler/callback/template context |
| `form/event.hsnips` | `СобытиеФормы.ПередЗакрытием` | form handler/callback/template context |
| `form/event.hsnips` | `СобытиеФормы.ПередЗаписьюНаСервере` | form handler/callback/template context |
| `form/event.hsnips` | `СобытиеФормы.ПриВставкеИзБуфераОбмена` | form handler/callback/template context |
| `form/event.hsnips` | `СобытиеФормы.ПриЗакрытии` | form handler/callback/template context |
| `form/event.hsnips` | `СобытиеФормы.ПриОткрытии` | form handler/callback/template context |
| `form/event.hsnips` | `СобытиеФормы.ПриСозданииНаСервере` | form handler/callback/template context |
| `form/helpers.hsnips` | `ВызовМодуляОбъекта` | form handler/callback/template context |
| `form/module.hsnips` | `МодульФормы.базовый` | form handler/callback/template context |
| `function.hsnips` | `Функция.Найти` | template/code-generation snippet |
| `helpers.hsnips` | `Выгрузить` | template/code-generation snippet |
| `helpers.hsnips` | `ВыделенныеСтроки` | control-flow template with insertion point |
| `helpers.hsnips` | `Документ` | editor shortcut; wrapper API would add no abstraction |
| `helpers.hsnips` | `ЗапросСВыборкой` | query/control-flow template |
| `helpers.hsnips` | `Найти` | control-flow template with insertion point |
| `helpers.hsnips` | `НайтиПоИдентификатору` | control-flow template with insertion point |
| `helpers.hsnips` | `НайтиСтроки` | control-flow template with insertion point |
| `helpers.hsnips` | `ОбратныйПока` | control-flow template with insertion point |
| `helpers.hsnips` | `Отбор` | template/code-generation snippet |
| `helpers.hsnips` | `Словарь` | template/code-generation snippet |
| `helpers.hsnips` | `СловарьПорядок` | template/code-generation snippet |
| `helpers.hsnips` | `Сообщить` | editor shortcut; wrapper API would add no abstraction |
| `helpers.hsnips` | `СправочникНайтиПоНаименованию` | template/code-generation snippet |
| `helpers.hsnips` | `СправочникНайтиПоРеквизиту` | template/code-generation snippet |
| `helpers.hsnips` | `ТаблицаЗначений` | template/code-generation snippet |
| `helpers.hsnips` | `Тип` | editor shortcut; wrapper API would add no abstraction |
| `helpers.hsnips` | `ТипМетаданных` | template/code-generation snippet |
| `helpers.hsnips` | `ТипЭлементаФормы` | editor shortcut; wrapper API would add no abstraction |
| `helpers.hsnips` | `УникальныйИдентификатор` | editor shortcut; wrapper API would add no abstraction |
| `helpers.hsnips` | `ЭтоСсылка` | editor shortcut; wrapper API would add no abstraction |
| `helpers.hsnips` | `ЭтоСсылкаНаДокумент` | template/code-generation snippet |
| `macros.hsnips` | `Вставка` | preprocessor/template construct |
| `macros.hsnips` | `Область` | preprocessor/template construct |
| `macros.hsnips` | `Удаление` | preprocessor/template construct |
| `query.hsnips` | `Выбрать` | query/control-flow template |
| `query.hsnips` | `Запрос` | query/control-flow template |
| `roles.hsnips` | `ТекущийПользователь` | editor shortcut; wrapper API would add no abstraction |
