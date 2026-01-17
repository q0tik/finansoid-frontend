import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import i18n from './i18n'

import '@/assets/main.css'
import '@/assets/theme.css'

import { setupHardcodedTokens } from '@/api/hardcode_auth.js'
setupHardcodedTokens();

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
