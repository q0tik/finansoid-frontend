<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useProfileStore } from '@/stores/profileStore'
// ДОБАВИЛ Info В ИМПОРТ
import { Copy, ShieldCheck, Info } from 'lucide-vue-next'
import ProfileInfoModal from '@/components/profile/ProfileInfoModal.vue'

const store = useProfileStore()
const showInfoModal = ref(false)
const copied = ref(false)
const showId = ref(false)
let timer = null

onMounted(async () => {
  if (store.profiles.length === 0) {
    await store.fetchProfiles()
  }
  timer = setInterval(toggleId, 3000)
})

const activeProfile = computed(() => {
  return store.profiles.find(p => p.id === store.activeProfile)
})

const toggleId = () => {
  showId.value = !showId.value
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const formatId = (id) => {
  if (!id) return '—'
  const s = String(id)
  return s.length > 10 ? `${s.slice(0, 5)}..${s.slice(-5)}` : s
}

const copyId = async () => {
  const id = activeProfile.value?.id
  if (!id) return
  try {
    await navigator.clipboard.writeText(String(id))
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
</script>

<template>
  <div class="bg-card border border-border rounded-[28px] p-5 shadow-sm shrink-0 relative overflow-hidden mb-4">
    
    <Transition name="fade-slide">
      <div v-if="copied" class="absolute top-3 right-5 bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg z-50">
        Copied
      </div>
    </Transition>

    <div class="flex items-center justify-between gap-4 text-left">
      <div class="flex items-center gap-4 min-w-0">
        <div class="relative w-14 h-14 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center border-2 border-blue-500/20 shadow-inner shrink-0">
          <ShieldCheck class="w-7 h-7" />
        </div>

        <div class="flex flex-col items-start min-w-0">
          <h2 class="text-xl font-black truncate leading-tight tracking-tight text-foreground italic">
            {{ activeProfile?.title || 'Loading...' }}
          </h2>
          
          <div class="mt-2">
            <button 
              @click="copyId"
              class="group flex items-center justify-between px-4 py-1.5 bg-muted/40 hover:bg-muted border border-border/50 rounded-full transition-all active:scale-[0.95] w-[150px]"
            >
              <div class="flex-1 flex justify-center overflow-hidden">
                <Transition name="text-swap" mode="out-in">
                  <span 
                    :key="showId"
                    class="text-[10px] text-muted-foreground font-black uppercase tracking-widest block whitespace-nowrap"
                  >
                    {{ showId ? formatId(activeProfile?.id) : 'Profile ID' }}
                  </span>
                </Transition>
              </div>
              <Copy class="w-3 h-3 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
            </button>
          </div>
        </div>
      </div>

      <button 
        type="button"
        @click="showInfoModal = true" 
        class="w-12 h-12 flex items-center justify-center bg-muted/30 hover:bg-blue-500/10 text-muted-foreground/40 hover:text-blue-500 rounded-2xl border border-border/50 transition-all active:scale-90 shrink-0"
      >
        <Info class="w-6 h-6" />
      </button>
    </div>

    <ProfileInfoModal 
      :show="showInfoModal" 
      :profile-id="activeProfile?.id" 
      @close="showInfoModal = false" 
    />
  </div>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.9);
}
.text-swap-enter-active, .text-swap-leave-active {
  transition: all 0.2s ease;
}
.text-swap-enter-from { opacity: 0; transform: translateY(5px); }
.text-swap-leave-to { opacity: 0; transform: translateY(-5px); }
</style>