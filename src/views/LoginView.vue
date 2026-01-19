<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { telegramCallback, loginMiniApp } from '@/api/auth'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profileStore'
import { useMiniAppStore } from '@/stores/miniAppStore'
import { Loader2 } from 'lucide-vue-next'

const router = useRouter()
const mini = useMiniAppStore()

const isAuthLoading = ref(false)
const loadingText = ref('Initializing...')

const funPhrases = [
  'Sniffing bitcoin...',
  'Cleaning transactions...',
  'Syncing currencies...',
  'Polishing coins...',
  'Counting taxes (just kidding)...',
  'Connecting to the moon...',
  'Fetching pocket money...'
]

let phraseInterval = null

function startFunPhrases() {
  loadingText.value = funPhrases[Math.floor(Math.random() * funPhrases.length)]
  phraseInterval = setInterval(() => {
    loadingText.value = funPhrases[Math.floor(Math.random() * funPhrases.length)]
  }, 2000)
}

onMounted(async () => {
  mini.init()

  // Если это Mini App, включаем режим загрузки
  if (mini.isMiniApp) {
    isAuthLoading.value = true
    startFunPhrases()
    
    if (mini.initData) {
      const res = await loginMiniApp(mini.initData)
      if (res.success) {
        await useProfileStore().ensureDefaultProfile()
        router.push('/')
        return // Выходим, чтобы не грузить скрипт виджета
      }
    }
    // Если авто-вход не удался, выключаем лоадер, чтобы юзер зашел руками
    isAuthLoading.value = false
    clearInterval(phraseInterval)
  }

  // ВСТАВЛЯЕМ TELEGRAM SCRIPT (для обычного веба)
  const script = document.createElement('script')
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.setAttribute('data-telegram-login', 'finansoid_bot')
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-width', '340')
  script.setAttribute('data-onauth', 'onTelegramAuth(user)')
  script.setAttribute('data-request-access', 'write')
  
  const container = document.getElementById('telegram-login')
  if (container) container.appendChild(script)

  window.onTelegramAuth = async function (user) {
    try {
      isAuthLoading.value = true
      const res = await telegramCallback(user)
      if (!res.success) {
        alert(res.error || 'Auth error')
        isAuthLoading.value = false
        return
      }
      await useProfileStore().ensureDefaultProfile()
      router.push('/')
    } catch (err) {
      console.error(err)
      isAuthLoading.value = false
    }
  }
})

onUnmounted(() => {
  if (phraseInterval) clearInterval(phraseInterval)
})
</script>

<template>
  <div
    class="h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden select-none"
    :style="{ backgroundColor: 'var(--bg-pages)', color: 'var(--text-pages)' }"
  >
    <div v-if="isAuthLoading" class="flex flex-col items-center animate-in fade-in zoom-in duration-500">
      <div class="relative mb-6">
        <div class="w-16 h-16 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
        <Loader2 class="w-6 h-6 text-sky-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <h1 class="text-2xl font-black italic tracking-tighter mb-2">Finansoid</h1>
      <p class="text-sm font-medium text-muted-foreground animate-pulse tracking-wide italic">
        {{ loadingText }}
      </p>
    </div>

    <div v-else class="max-w-sm w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 class="text-4xl font-black mb-12 tracking-tighter italic italic-bold">
        Finansoid
      </h1>

      <div class="w-full space-y-3">
        <div class="relative w-full h-[52px] group">
          <div id="telegram-login" class="opacity-0 absolute inset-0 z-20 flex justify-center [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:cursor-pointer"></div>
          <div class="absolute inset-0 z-10 flex items-center justify-center gap-3 w-full bg-sky-500/10 border border-sky-500/20 rounded-2xl transition-all group-active:scale-[0.98]">
            <svg class="w-5 h-5 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
               <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
            </svg>
            <span class="text-sm font-bold text-sky-500">Continue with Telegram</span>
          </div>
        </div>

        <div class="relative w-full h-[52px]">
          <div class="flex items-center justify-center gap-3 w-full h-full bg-white/5 border border-white/10 rounded-2xl opacity-20 grayscale cursor-not-allowed">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="text-sm font-bold">Continue with Google</span>
          </div>
        </div>

        <div class="relative w-full h-[52px]">
          <div class="flex items-center justify-center gap-3 w-full h-full bg-white/5 border border-white/10 rounded-2xl opacity-20 grayscale cursor-not-allowed">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <span class="text-sm font-bold">Continue with GitHub</span>
          </div>
        </div>
      </div>
      
      <p class="mt-12 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">
        Secure cloud synchronization
      </p>
    </div>
  </div>
</template>

<style scoped>
#telegram-login :deep(iframe) {
  width: 100% !important;
  height: 52px !important;
  opacity: 0 !important;
  cursor: pointer !important;
  transform: scale(2); 
  transform-origin: center;
}

#telegram-login {
  overflow: hidden;
  border-radius: 1rem;
}
</style>