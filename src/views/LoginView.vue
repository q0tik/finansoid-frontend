<script setup>
import { ref, onMounted } from 'vue'
import { telegramCallback, loginMiniApp } from '@/api/auth'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profileStore'
import { useMiniAppStore } from '@/stores/miniAppStore'
import { Lock, Ban } from 'lucide-vue-next'

const router = useRouter()

onMounted(async () => {
  // ИНИЦИАЛИЗАЦИЯ MINI-APP
  const mini = useMiniAppStore()
  mini.init()

  if (mini.isMiniApp && mini.initData) {
    const res = await loginMiniApp(mini.initData)
    if (res.success) router.push('/')
  }

  // ВСТАВЛЯЕМ TELEGRAM SCRIPT
  const script = document.createElement('script')
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.setAttribute('data-telegram-login', 'finansoid_bot')
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-onauth', 'onTelegramAuth(user)')
  script.setAttribute('data-request-access', 'write')
  document.getElementById('telegram-login').appendChild(script)

  window.onTelegramAuth = async function (user) {
    try {
      const res = await telegramCallback(user)
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
    class="min-h-screen flex flex-col justify-center px-6"
    :style="{ backgroundColor: 'var(--bg-pages)', color: 'var(--text-pages)' }"
  >
    <div class="max-w-sm mx-auto w-full -mt-20">
      <h1 class="text-3xl font-black mb-8 text-center tracking-tight">Finansoid</h1>

      <div class="bg-card border border-border/50 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-sky-500"></div>
        <div class="text-center mb-6">
          <p class="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 mb-2">Fast Access</p>
          <h2 class="text-lg font-bold">Sign in via Telegram</h2>
        </div>
        
        <div class="flex justify-center">
          <div id="telegram-login"></div>
        </div>
      </div>

      <div class="relative mt-12 group">
        <div class="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div class="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2">
                <Ban class="w-3 h-3" /> 
                Method Deprecated
            </div>
        </div>

        <div class="opacity-20 blur-[1px] select-none line-through decoration-red-500/50 decoration-2 space-y-4 filter grayscale">
          <div>
            <label class="text-[10px] font-black uppercase tracking-widest ml-1">Username</label>
            <div class="w-full h-10 border border-border rounded-xl mt-1"></div>
          </div>
          <div>
            <label class="text-[10px] font-black uppercase tracking-widest ml-1">Password</label>
            <div class="w-full h-10 border border-border rounded-xl mt-1"></div>
          </div>
          <div class="w-full h-12 bg-muted rounded-xl"></div>
          <div class="w-full h-12 border border-border rounded-xl"></div>
        </div>
      </div>

      <p class="text-center mt-12 text-[10px] font-medium text-muted-foreground/40 uppercase tracking-[0.3em]">
        Secure cloud synchronization
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Добавим легкое дрожание для зачеркнутой части, чтобы подчеркнуть "сломанность" */
.line-through {
  text-decoration-thickness: 2px;
}
</style>