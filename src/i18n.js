import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ru from './locales/ru.json'

const i18n = createI18n({
  legacy: false, // Обязательно false для Composition API
  locale: localStorage.getItem('lang') || 'en', // Сохраняем выбор языка
  fallbackLocale: 'en',
  messages: { en, ru }
})

export default i18n