export interface MigrationRecord {
  file: string;
  trigger: string;
  target: string;
}

// Only snippets whose behavior is naturally reusable as a standalone API are
// removed from HyperSnips. A runtime helper must add useful semantics, policy,
// validation, composition, or non-trivial reusable behavior; a wrapper that only
// renames an already-clear 1C API remains an editor snippet. Short helpers are
// still valid when their name materially improves intent (for example Модуль).
// Event handlers, callback skeletons, control-flow templates, preprocessor
// blocks, code-completion shortcuts and required 1C entry points also remain snippets.
export const migratedSnippets: MigrationRecord[] = [
  {
    file: "bsl.hsnips",
    trigger: "ЧитатьJSON",
    target: "SharedToolkit_JSON.ПрочитатьJSONИзСтроки",
  },
  {
    file: "bsl.hsnips",
    trigger: "МассивВСтроку",
    target: "SharedToolkit_Значения.ОбъектВСтроку",
  },
  {
    file: "bsl.hsnips",
    trigger: "ОткрытьФормуОбъекта",
    target: "SharedToolkit_Формы.ОткрытьФормуОбъекта",
  },
  {
    file: "bsl.hsnips",
    trigger: "ОткрытьФормуСписка",
    target: "SharedToolkit_Формы.ОткрытьФормуСписка",
  },
  {
    file: "bsl.hsnips",
    trigger: "ВыполнитьPython",
    target: "SharedToolkit_Интеграция.ВыполнитьPython",
  },
  {
    file: "bsl.hsnips",
    trigger: "ЗаполнитьПоСтрокеТЧ",
    target: "SharedToolkit_Интеграция.ЗаполнитьСтрокуXBaseИзСпискаДанных",
  },
  {
    file: "bsl.hsnips",
    trigger: "ПолучитьОбъектПоЗначениюСвойства",
    target:
      "SharedToolkit_ДополнительныеСвойства.ПолучитьОбъектПоЗначениюСвойства",
  },
  {
    file: "bsl.hsnips",
    trigger: "УстановитьСвойство",
    target: "SharedToolkit_ДополнительныеСвойства.УстановитьСвойство",
  },

  {
    file: "bsp/bsp.hsnips",
    trigger: "Функция.ЗапросВерсийОбъекта",
    target: "SharedToolkit_Версионирование.ЗапросВерсийОбъекта",
  },
  {
    file: "bsp/bsp.hsnips",
    trigger: "Функция.ПрочитатьХранилищеЗначенийИстории",
    target: "SharedToolkit_Версионирование.ПрочитатьВерсиюОбъекта",
  },

  {
    file: "document.creation.hsnips",
    trigger: "Функция.СоздатьТаможеннуюДекларациюИмпортПоJSON",
    target: "SharedToolkit_ГТД.СоздатьТаможеннуюДекларациюИмпортПоJSON",
  },

  {
    file: "external_data_proccesor/external_data_proccesor.hsnips",
    trigger: "ДобавитьКомандуВнешнейОбработки",
    target: "SharedToolkit_ВнешниеОбработки.ДобавитьКоманду",
  },
  {
    file: "external_data_proccesor/external_data_proccesor.hsnips",
    trigger: "ЗапросДополнительныйОтчетИлиОбработка",
    target:
      "SharedToolkit_ВнешниеОбработки.НайтиДополнительнуюОбработкуПоИмениОбъекта",
  },
  {
    file: "external_data_proccesor/external_data_proccesor.hsnips",
    trigger: "ОткрытьФормуДополнительнойОбработкиБСП",
    target:
      "SharedToolkit_ВнешниеОбработки.ОткрытьФормуДополнительнойОбработкиБСП",
  },
  {
    file: "external_data_proccesor/external_data_proccesor.hsnips",
    trigger: "ОткрытьФормуДополнительнойОбработки",
    target: "SharedToolkit_ВнешниеОбработки.ПодключитьИОткрытьВнешнююОбработку",
  },
  {
    file: "external_data_proccesor/external_data_proccesor.hsnips",
    trigger: "ПолучитьСсылкуНаДополнительнуюОбработкуПоИмени",
    target:
      "SharedToolkit_ВнешниеОбработки.НайтиДополнительнуюОбработкуПоИмениОбъекта",
  },
  {
    file: "external_data_proccesor/external_data_proccesor.hsnips",
    trigger: "РаботаСНастройкамиВнешнейОбработки",
    target:
      "SharedToolkit_ВнешниеОбработки.СохранитьНастройки / ЗагрузитьНастройки",
  },
  {
    file: "external_data_proccesor/functions.hsnips",
    trigger: "Функция.ЗафиксироватьВЖурналеРегистрации",
    target: "SharedToolkit_ЖурналРегистрации.ЗаписатьДляВнешнейОбработки",
  },
  {
    file: "external_data_proccesor/functions.hsnips",
    trigger: "Функция.ПодготовитьДанныеДляДлительнойОперации",
    target:
      "SharedToolkit_ВнешниеОбработки.ПодготовитьДанныеДляДлительнойОперации",
  },

  {
    file: "form/create.element.hsnips",
    trigger: "(Добавить|Вставить)Элемент",
    target: "SharedToolkit_Формы.СоздатьПолеФормы",
  },
  {
    file: "form/create.element.hsnips",
    trigger: "ПолеВводаПолное",
    target: "SharedToolkit_Формы.СоздатьПолеФормы / НастроитьПолеФормы",
  },
  {
    file: "form/helpers.hsnips",
    trigger: "Процедура.ОбновитьИдентификаторыИзСтаройФормы",
    target: "SharedToolkit_Формы.ОбновитьИдентификаторыИзСтаройФормы",
  },

  {
    file: "function.hsnips",
    trigger: "Функция.Получить",
    target: "SharedToolkit_Коллекции.ПолучитьИзКоллекции",
  },
  {
    file: "helpers.hsnips",
    trigger: "ОткрытьФормуОбщий",
    target: "SharedToolkit_Формы.ОткрытьФормуСПараметрами",
  },
  {
    file: "helpers.hsnips",
    trigger: "Функция.ЭтоКопия",
    target: "SharedToolkit_БСП.ЭтоКопияИнформационнойБазы",
  },
  {
    file: "helpers.hsnips",
    trigger: "МассоваяПометкаНаУдаление",
    target: "SharedToolkit_ДокументыУТ.ПометитьДокументыНаУдаление",
  },
  {
    file: "helpers.hsnips",
    trigger: "ЗаполнитьДопСвойства",
    target:
      "SharedToolkit_ДополнительныеСвойства.ЗаписатьДополнительноеСвойство",
  },

  {
    file: "journaling.hsnips",
    trigger: "ЗаписьЖурналаРегистрации",
    target: "SharedToolkit_ЖурналРегистрации.Записать",
  },
  {
    file: "kontragent.hsnips",
    trigger: "Процедура.ЗаполнитьЮрАдресКонтрагентаПоИНН",
    target: "SharedToolkit_КонтрагентыУТ.ЗаполнитьЮридическийАдресПоИНН",
  },
  {
    file: "math.hsnips",
    trigger: "Функция.Модуль",
    target: "SharedToolkit_Математика.Модуль",
  },
  {
    file: "queries/queries.hsnips",
    trigger: "ЗапросКонтрагентыСЮрАдресомВСвободнойФорме",
    target:
      "SharedToolkit_КонтрагентыУТ.ЗапросКонтрагентовСЮридическимАдресомВСвободнойФорме",
  },
  {
    file: "roles.hsnips",
    trigger: "ПользовательВГруппеПользователей",
    target: "SharedToolkit_Пользователи.ПользовательВГруппе",
  },
  {
    file: "roles.hsnips",
    trigger: "ПользовательВГруппеДоступа",
    target: "SharedToolkit_Пользователи.ПользовательВГруппе",
  },
];

export function migrationKey(file: string, trigger: string): string {
  return `${file}\u0000${trigger}`;
}
