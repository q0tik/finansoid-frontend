import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ru from './locales/ru.json'
import ka from './locales/ka.json'
import zh from './locales/zh.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'en',
  fallbackLocale: 'en',
  messages: { en, ru, ka, zh }
})

export default i18n
