<script setup>
import { ref } from 'vue'
import { register } from '@/api/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')
const password2 = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleRegister() {
    if (!username.value || !password.value || !password2.value) {
        errorMsg.value = 'Заполните все поля'
        return
    }

    if (password.value !== password2.value) {
        errorMsg.value = 'Пароли не совпадают'
        return
    }

    loading.value = true
    errorMsg.value = ''

    const res = await register(username.value, password.value)

    loading.value = false

    if (!res.success) {
        errorMsg.value = res.error || 'Ошибка регистрации'
        return
    }

    router.push('/login')
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col justify-center px-6"
    :style="{
      backgroundColor: 'var(--bg-pages)',
      color: 'var(--text-pages)'
    }"
  >
    <h1 class="text-2xl font-semibold mb-6 text-center">Register</h1>

    <div class="space-y-4 max-w-sm mx-auto w-full">

      <div>
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

      <div>
        <label class="text-sm block mb-1">Repeat password</label>
        <input
          v-model="password2"
          type="password"
          class="w-full px-3 py-2 border rounded"
          :style="{
            borderColor: 'var(--border-footer)',
            backgroundColor: 'transparent',
            color: 'var(--text-pages)'
          }"
        />
      </div>

      <div v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</div>

      <button
        @click="handleRegister"
        :disabled="loading"
        class="w-full py-2 rounded active:scale-[0.98] transition disabled:opacity-50"
        :style="{
          backgroundColor: 'var(--accent)',
          color: 'var(--text-on-accent)'
        }"
      >
        {{ loading ? 'Registering...' : 'Register' }}
      </button>

      <!-- Кнопка назад на логин -->
      <button
        @click="router.push('/login')"
        class="w-full py-2 rounded mt-2 border"
        :style="{
          borderColor: 'var(--border-footer)',
          color: 'var(--text-pages)'
        }"
      >
        Back to Login
      </button>

    </div>
  </div>
</template>