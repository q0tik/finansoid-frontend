<script setup>
import { AlertTriangle, Info } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineProps({
  show: Boolean,
  title: { type: String, default: 'Are you sure?' },
  description: { type: String, default: 'This action cannot be undone.' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  danger: { type: Boolean, default: false }
})

const emits = defineEmits(['close', 'confirm'])
</script>

<template>
  <transition name="fade">
    <div 
      v-if="show" 
      class="fixed inset-0 flex justify-center items-center z-[100] bg-background/80 backdrop-blur-sm p-4" 
      @click.self="emits('close')"
    >
      <div class="bg-card text-card-foreground rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-border animate-in zoom-in-95 duration-200">
        
        <div class="flex items-start gap-4 mb-6">
          <div 
            class="p-3 rounded-full shrink-0 flex items-center justify-center"
            :class="danger ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'"
          >
            <AlertTriangle v-if="danger" class="w-6 h-6" />
            <Info v-else class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg font-bold leading-none mb-2">{{ title }}</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ description }}</p>
          </div>
        </div>

        <div class="flex gap-3 justify-end">
          <Button 
            variant="ghost" 
            class="rounded-xl hover:bg-muted" 
            @click="emits('close')"
          >
            {{ cancelText }}
          </Button>
          
          <Button 
            :variant="danger ? 'destructive' : 'default'"
            class="rounded-xl px-6 font-bold shadow-sm"
            @click="emits('confirm')"
          >
            {{ confirmText }}
          </Button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>