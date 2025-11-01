import './assets/tailwind.css'
import 'ant-design-vue/dist/reset.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import Antd from 'ant-design-vue'

// Load theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Antd)
app.mount('#app')
