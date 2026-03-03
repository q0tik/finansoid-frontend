# CLAUDE.md

## .ctx
Фронтенд для приложения учёта финансов finansoid. Работает как Telegram Mini App и как веб-приложение. Ключевые особенности: шаринг счетов между пользователями, учёт любых активов, сложные транзакции с комиссией в третьей валюте.

## Стек
- **Vue 3.5** (Composition API, `<script setup>`)
- **Vite 7** — сборщик
- **Pinia** — стейт-менеджмент
- **Vue Router 4** — маршрутизация (hash history)
- **Axios** — HTTP-клиент, с интерцептором авто-рефреша токена
- **Tailwind CSS 4** + **Reka-UI** (shadcn-vue) + **Lucide** — UI
- **Vue-i18n 10** — локализация (en / ru / ka / zh)
- **VueUse** — composition utilities

## Запуск
```bash
npm run dev      # dev-сервер
npm run build    # production build
npm run preview  # превью прод-сборки
```
Бэкенд URL задаётся через `VITE_BACKEND_URL` (см. `config/local.toml`).

## Архитектура

```
src/
├── api/              # Axios-функции по модулям (accounts, transactions, ...)
│   └── client.js     # Axios instance + интерцепторы (X-Profile-ID, token refresh)
├── assets/           # main.css (Tailwind) + theme.css (CSS-переменные light/dark/custom)
├── components/       # Общие компоненты (BottomNav, ConfirmModal, Toast, ui/*)
├── composables/      # Глобальные composables (useDefaultTitles, useInfiniteScroll)
├── features/         # Фича-модули (transactions, accounts, categories, currencies, profile, settings)
│   └── {feature}/
│       ├── composables/use{Feature}.js   # стейт + вызовы API
│       └── components/                   # UI компоненты фичи
├── lib/              # format.js (форматирование транзакций), utils.js (cn())
├── locales/          # en.json, ru.json, ka.json, zh.json
├── router/index.js   # маршруты (home, login, register, transactions, profile, settings, add-transaction)
├── stores/           # Pinia stores (profileStore, miniAppStore)
└── views/            # Page-компоненты, по одному на маршрут
```

### Ключевые паттерны

**Данные и стейт:**
- Composable (`use{Feature}.js`) управляет `ref`-ами, вызывает API, отдаёт состояние компоненту
- API-функции в `src/api/{module}.js`, возвращают `{ success, data, pagination }`
- Активный профиль хранится в `profileStore.activeProfile` (UUID в localStorage); передаётся каждым запросом через заголовок `X-Profile-ID`

**Компоненты:**
- Views (`src/views/`) — страницы, координируют фичи
- Feature components (`src/features/*/components/`) — доменный UI
- UI primitives (`src/components/ui/`) — shadcn-vue компоненты без бизнес-логики
- Модальные окна: пропс `show: Boolean`, эмиты `'close'` и `'created'`

**Роутинг:**
- Фильтры транзакций синхронизируются с query-параметрами URL через `router.replace()`
- Все views загружаются динамически (`() => import(...)`)

**Темизация:**
- Класс `.dark` на `<html>` — тёмная тема; атрибут `data-theme` — кастомные темы (mint, desert, frost)
- Хранится в localStorage как `'user-theme'`, применяется в `App.vue` → `onMounted`

---

## Чеклист при реализации фичи

### Обязательно проверить:

1. **Переводы** — если добавляется новый текст, обновить **все 4 файла**:
   - `src/locales/en.json`
   - `src/locales/ru.json`
   - `src/locales/ka.json`
   - `src/locales/zh.json`
   - Ключи: `snake_case`, вложенные объекты (`common.save`, `transactions.add_expense`)
   - В компоненте использовать `const { t } = useI18n()`, не хардкодить строки

2. **API слой** — новый endpoint = новая функция в `src/api/{module}.js`, не вызывать axios напрямую из компонентов

3. **X-Profile-ID** — все запросы к `/finansoid-api/v1/*` должны идти через `client.js` (он автоматически подставляет заголовок)

4. **Soft delete / стейт после удаления** — при удалении сущности убрать её из локального `ref`-массива (не перезапрашивать весь список без необходимости)

5. **Пагинация** — если список может быть длинным, использовать `useInfiniteScroll` + флаг `append` в composable

6. **Маршруты** — если добавляется новая страница, добавить роут в `src/router/index.js` с динамическим импортом; если страница без нижней навигации — `meta: { hideFooter: true }`

7. **Иконки** — использовать только из `lucide-vue-next` (`import { PlusIcon } from 'lucide-vue-next'`)

8. **Темизация** — не хардкодить цвета, использовать CSS-переменные (`bg-background`, `text-foreground`, `bg-primary` и т.д.)

9. **Telegram Mini App** — проверить, что новый UI не ломает мобильный вид; сенсорные события — `touch-action: manipulation` уже установлен глобально

10. **Новые дефолтные сущности** — если добавляются системные категории/валюты, добавить маппинг UUID → i18n-ключ в `src/composables/useDefaultTitles.js`

---

## Конвенции кода

- Только `<script setup>` синтаксис, без Options API
- `defineProps()` и `defineEmits()` — всегда явно
- Имена компонентов: `PascalCase`; файлы компонентов: `PascalCase.vue`; composables: `camelCase.js`
- Форматирование транзакций — через `src/lib/format.js` (не дублировать логику)
- Классы: утилита `cn()` из `src/lib/utils.js` для условного слияния
- Никаких прямых обращений к `localStorage` вне store/composable — инкапсулировать
