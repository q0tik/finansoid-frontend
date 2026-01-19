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
    class="h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden"
    :style="{ backgroundColor: 'var(--bg-pages)', color: 'var(--text-pages)' }"
  >
    <div class="max-w-sm w-full flex flex-col items-center">
      
      <h1 class="text-4xl font-black mb-10 tracking-tighter italic">
        Finansoid
      </h1>

      <div class="w-full bg-card border border-border/50 rounded-[32px] p-8 shadow-2xl relative mb-8">
        <div class="absolute top-0 left-0 w-full h-1 bg-sky-500"></div>
        <div class="text-center mb-6">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 mb-1">
            Recommended
          </p>
          <h2 class="text-lg font-bold">Sign in via Telegram</h2>
        </div>
        
        <div class="flex justify-center">
          <div id="telegram-login"></div>
        </div>
      </div>

      <div class="w-full space-y-3 opacity-30 grayscale pointer-events-none">
        <div class="flex items-center justify-center gap-3 w-full py-3.5 bg-white/5 border border-white/10 rounded-2xl">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span class="text-sm font-bold">Continue with Google</span>
        </div>

        <div class="flex items-center justify-center gap-3 w-full py-3.5 bg-white/5 border border-white/10 rounded-2xl">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          <span class="text-sm font-bold">Continue with GitHub</span>
        </div>
      </div>

      <p class="mt-10 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
        Secure cloud synchronization
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Плавное появление контента при загрузке */
.max-w-sm {
  animation: entrance 0.6s ease-out;
}

@keyframes entrance {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>