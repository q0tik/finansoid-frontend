<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getMe } from '@/api/user'
import { Copy } from 'lucide-vue-next'

const user = ref(null)
const loadingUser = ref(true)
const imageError = ref(false)
const copied = ref(false)

// Состояние для переключения текста: true — ID, false — надпись "USER ID"
const showId = ref(false)
let timer = null

// Используй функцию обертку, если боишься "оценки строк"
const toggleId = () => {
  showId.value = !showId.value
}

onMounted(async () => {
  const res = await getMe()
  if (res?.success) user.value = res.user
  loadingUser.value = false

  // Передаем ссылку на функцию напрямую, это максимально безопасно
  timer = setInterval(toggleId, 3000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const formatId = (id) => {
  if (!id) return '—'
  return `${id.slice(0, 5)}...${id.slice(-5)}`
}

const handleImageError = () => {
  imageError.value = true
}

const copyId = async () => {
  if (!user.value?.id) return
  try {
    await navigator.clipboard.writeText(user.value.id)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
</script>

<template>
  <div class="bg-card border border-border rounded-[28px] p-5 shadow-sm shrink-0 relative overflow-hidden">
    
    <Transition name="fade-slide">
      <div v-if="copied" class="absolute top-3 right-5 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg z-50">
        Copied
      </div>
    </Transition>

    <div v-if="loadingUser" class="flex items-center gap-4 animate-pulse">
      <div class="w-14 h-14 bg-muted rounded-full"></div>
      <div class="space-y-2">
        <div class="h-4 w-24 bg-muted rounded"></div>
        <div class="h-3 w-32 bg-muted rounded"></div>
      </div>
    </div>

    <div v-else class="flex items-center gap-4 text-left justify-start">
      <div class="relative w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-black border-2 border-primary/20 shadow-inner overflow-hidden shrink-0">
        <img 
          v-if="user?.userpic_url && !imageError" 
          :src="user.userpic_url" 
          @error="handleImageError"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <span v-else>
          {{ user?.username?.charAt(0).toUpperCase() || '?' }}
        </span>
      </div>

      <div class="flex flex-col items-start min-w-0">
        <h2 class="text-lg font-black truncate leading-tight tracking-tight text-foreground w-full">
          {{ user?.username || 'User' }}
        </h2>
        
        <div class="mt-2">
          <button 
            @click="copyId"
            class="group flex items-center justify-between px-4 py-1.5 bg-muted/40 hover:bg-muted border border-border/50 rounded-full transition-all active:scale-95 w-[135px]"
          >
            <div class="flex-1 flex justify-center overflow-hidden">
              <Transition name="text-swap" mode="out-in">
                <span 
                  :key="showId"
                  class="text-[10px] text-muted-foreground font-black uppercase tracking-widest block whitespace-nowrap"
                >
                  {{ showId ? formatId(user?.id) : 'User ID' }}
                </span>
              </Transition>
            </div>
            
            <Copy class="w-3 h-3 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Анимация "вылеталочки" Copied */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.9);
}

/* Анимация смены текста внутри кнопки */
.text-swap-enter-active,
.text-swap-leave-active {
  transition: all 0.2s ease;
}
.text-swap-enter-from {
  opacity: 0;
  transform: translateY(5px);
}
.text-swap-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>