<script setup>
import { ref, computed } from 'vue'
import { Send, Loader2, CheckCircle2, Bug, Lightbulb, MessageCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'
import { createFeedback } from '@/api/feedback'

const { t } = useI18n()

const feedbackText = ref('')
const feedbackType = ref('bug')
const isSending = ref(false)
const sentSuccess = ref(false)

const types = computed(() => [
  { id: 'bug', label: t('feedback.bug'), icon: Bug, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'feature', label: t('feedback.idea'), icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'other', label: t('feedback.other'), icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' }
])

const submit = async () => {
  if (!feedbackText.value.trim() || isSending.value) return
  isSending.value = true
  
  try {
    const res = await createFeedback(
      feedbackText.value, 
      feedbackType.value
    )
    
    if (res && res.success !== false) {
      sentSuccess.value = true
      feedbackText.value = ''
      setTimeout(() => { sentSuccess.value = false }, 3000)
    }
  } catch (err) {
    console.error(err)
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div class="space-y-4 pt-1">
    <div class="flex p-1 bg-muted/50 rounded-2xl gap-1">
      <button 
        v-for="type in types" 
        :key="type.id"
        @click="feedbackType = type.id"
        :class="[
          'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
          feedbackType === type.id 
            ? `bg-card shadow-sm border border-border ${type.color}` 
            : 'text-muted-foreground opacity-50 hover:opacity-100'
        ]"
      >
        <component :is="type.icon" class="w-3.5 h-3.5" />
        {{ type.label }}
      </button>
    </div>

    <div class="relative group">
      <textarea 
        v-model="feedbackText"
        :placeholder="$t('feedback.placeholder')"
        class="w-full bg-muted/30 border border-border/50 rounded-[24px] p-5 text-sm min-h-[150px] outline-none focus:border-primary/30 focus:bg-card transition-all resize-none custom-scrollbar shadow-inner"
        :disabled="isSending || sentSuccess"
      ></textarea>
      
      <transition name="fade">
        <div v-if="sentSuccess" class="absolute inset-0 bg-card/95 backdrop-blur-md rounded-[24px] flex flex-col items-center justify-center text-emerald-500 z-10 border border-emerald-500/20">
          <div class="bg-emerald-500/10 p-4 rounded-full mb-3">
            <CheckCircle2 class="w-8 h-8 animate-in zoom-in duration-500" />
          </div>
          <span class="text-[11px] font-black uppercase tracking-[0.2em]">{{ $t('feedback.thank_you') }}</span>
        </div>
      </transition>
    </div>

    <Button 
      class="w-full h-14 rounded-[22px] bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/10 transition-all active:scale-[0.97]"
      @click="submit"
      :disabled="!feedbackText.trim() || isSending || sentSuccess"
    >
      <Loader2 v-if="isSending" class="w-4 h-4 animate-spin mr-3" />
      <Send v-else class="w-4 h-4 mr-3" />
      {{ $t('feedback.send') }}
    </Button>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
</style>
