<script setup>
import { ref, onMounted } from 'vue'
import { login, telegramCallback, loginMiniApp} from '@/api/auth'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profileStore'
import { useMiniAppStore } from '@/stores/miniAppStore'

const router = useRouter()

// const username = ref('')
// const password = ref('')
// const loading = ref(false)
// const errorMsg = ref('')

// async function handleLogin() {
//   if (!username.value || !password.value) {
//     errorMsg.value = 'Введите логин и пароль'
//     return
//   }

//   loading.value = true
//   errorMsg.value = ''

//   const res = await login(username.value, password.value)

//   loading.value = false

//   if (!res.success) {
//     errorMsg.value = res.error || 'Ошибка авторизации'
//     return
//   }

//   router.push('/')
// }

onMounted(async () => {
  // ИНИЦИАЛИЗАЦИЯ MINI-APP
  const mini = useMiniAppStore()
  mini.init()

  // Если MiniApp + есть initData → сразу авторизуем
  if (mini.isMiniApp && mini.initData) {
    const res = await loginMiniApp(mini.initData)
    if (res.success) router.push('/')
  }

  // ВСТАВЛЯЕМ TELEGRAM SCRIPT
  const script = document.createElement('script')
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.setAttribute('data-telegram-login', 'finansoid_bot')
  script.setAttribute('data-size', 'large')
  // script.setAttribute('data-userpic', 'false')
  script.setAttribute('data-onauth', 'onTelegramAuth(user)')
  script.setAttribute('data-request-access', 'write')
  document.getElementById('telegram-login').appendChild(script)

  // callback
  window.onTelegramAuth = async function (user) {
    try {
      const res = await telegramCallback(user)
      console.log(res)
  
      if (!res.success) {
        alert(res.error || 'Auth error')
        return
      }

      await useProfileStore().ensureDefaultProfile()
      router.push('/')
    } catch (err) {
      console.error(err)
      alert('Telegram auth failed')
    }
  }
})
</script>

<template>
  <div
    class="min-h-screen flex flex-col justify-center px-6 -mt-24"
    :style="{
      backgroundColor: 'var(--bg-pages)',
      color: 'var(--text-pages)'
    }"
  >
    <h1 class="text-2xl font-semibold mb-6 text-center">Authorize</h1>

    <div class="space-y-4 max-w-sm mx-auto w-full">

      <!-- <div>
        <label class="text-sm block mb-1">Username</label>
        <input
          v-model="username"
          type="text"
          class="w-full px-3 py-2 border rounded"
          :style="{
            borderColor: 'var(--border-footer)',
            backgroundColor: 'transparent',
            color: 'var(--text-pages)'
          }"
        />
      </div>

      <div>
        <label class="text-sm block mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          class="w-full px-3 py-2 border rounded"
          :style="{
            borderColor: 'var(--border-footer)',
            backgroundColor: 'transparent',
            color: 'var(--text-pages)'
          }"
        />
      </div>

      <div v-if="errorMsg" class="text-red-500 text-sm">
        {{ errorMsg }}
      </div>

      <button
        @click="handleLogin"
        :disabled="loading"
        class="w-full py-2 rounded active:scale-[0.98] transition disabled:opacity-50"
        :style="{
          backgroundColor: 'var(--accent)',
          color: 'var(--text-on-accent)'
        }"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <button
          @click="router.push('/register')"
          class="w-full py-2 rounded mt-2 border"
          :style="{
              borderColor: 'var(--border-footer)',
              color: 'var(--text-pages)'
          }"
      >
          Register
      </button> -->
      <!-- Telegram Login -->
      <div class="mt-6 flex justify-center">
        <div id="telegram-login"></div>
      </div>
    </div>
  </div>
</template>
