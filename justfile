set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

project_root := justfile_directory()
target_platform := env_var_or_default("ONEC_TARGET_PLATFORM", "8.3.27")

# Initialize a new Designer XML extension against a real base configuration.
# The command refuses to overwrite an existing destination.
init base:
    test ! -e "{{project_root}}/src/Configuration.xml" || { echo "src/ is already initialized" >&2; exit 1; }
    onec meta create-extension "{{base}}" "{{project_root}}/src" SharedToolkit --synonym "Общий набор инструментов" --purpose AddOn

# Add an empty common module. Recipes accept only the suffix and add the
# SharedToolkit_ prefix automatically.
add-server-module suffix synonym:
    onec meta create-common-module "{{project_root}}/src" "SharedToolkit_{{suffix}}" --synonym "{{synonym}}" --platform-version "{{target_platform}}"

add-client-module suffix synonym:
    onec meta create-common-module "{{project_root}}/src" "SharedToolkit_{{suffix}}" --synonym "{{synonym}}" --client-managed --no-server --no-server-call --platform-version "{{target_platform}}"

add-shared-module suffix synonym:
    onec meta create-common-module "{{project_root}}/src" "SharedToolkit_{{suffix}}" --synonym "{{synonym}}" --client-managed --platform-version "{{target_platform}}"

# Bootstrap the original 16 modules once, through the canonical metadata CLI.
bootstrap-common-modules:
    test ! -d "{{project_root}}/src/CommonModules" || { echo "CommonModules are already initialized" >&2; exit 1; }
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_Коллекции --synonym "Коллекции" --client-managed --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_JSON --synonym "JSON" --client-managed --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_Математика --synonym "Математика" --client-managed --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_Значения --synonym "Значения" --client-managed --no-server-call --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_Формы --synonym "Формы" --client-managed --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_Файлы --synonym "Файлы" --client-managed --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_ВнешниеОбработки --synonym "Внешние обработки" --client-managed --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_ДополнительныеСвойства --synonym "Дополнительные свойства" --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_Пользователи --synonym "Пользователи и группы" --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_Версионирование --synonym "Версионирование" --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_ЖурналРегистрации --synonym "Журнал регистрации" --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_КонтрагентыУТ --synonym "Контрагенты УТ" --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_Интеграция --synonym "Интеграция" --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_ДокументыУТ --synonym "Документы УТ" --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_ГТД --synonym "ГТД" --platform-version "{{target_platform}}"
    onec meta create-common-module "{{project_root}}/src" SharedToolkit_БСП --synonym "БСП" --platform-version "{{target_platform}}"

inspect:
    onec meta inspect "{{project_root}}/src"

capabilities:
    onec meta capabilities "{{target_platform}}"

retarget-base base:
    onec meta retarget-extension "{{project_root}}/src" "{{base}}"

qualify-calls:
    onec meta qualify-common-module-calls "{{project_root}}/src"

# Read-only check against the checked-in inventory and the live HyperSnips tree.
verify-snippets:
    deno run -A "{{project_root}}/tools/verify_snippet_migration.ts"

# Validate the exact Designer XML source and all project-local source contracts.
verify: verify-snippets
    onec meta inspect "{{project_root}}/src" >/dev/null
    onec meta validate "{{project_root}}/src" --platform-version "{{target_platform}}"
