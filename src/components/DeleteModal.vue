<script setup>
import { ref, watch, nextTick } from 'vue'
import { X, AlertTriangle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps({
  show: Boolean,
  // Название объекта (профиля или счета), которое нужно ввести для подтверждения
  entityTitle: {
    type: String,
    required: true
  },
  // Кастомный текст описания (опционально)
  description: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['close', 'confirm'])

const confirmText = ref('')

function handleConfirm() {
  if (confirmText.value.trim() !== props.entityTitle) return
  emits('confirm')
  confirmText.value = ''
  emits(['close']) // Закрываем после подтверждения
}

// Очистка и фокус при открытии
watch(() => props.show, (open) => {
  if (open) {
    confirmText.value = ''
    nextTick(() => document.getElementById('confirm-delete-input')?.focus())
  }
})
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 flex justify-center items-center z-[100] bg-background/80 backdrop-blur-sm p-4"
      @click.self="emits('close')"
    >
      <div class="bg-card text-card-foreground rounded-2xl shadow-xl w-full max-w-sm p-6 border border-border animate-in zoom-in-95 duration-200">
        
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2 text-destructive">
            <AlertTriangle class="w-5 h-5" />
            <h2 class="text-lg font-bold">Dangerous Action</h2>
          </div>
          <button @click="emits('close')" class="p-1 hover:bg-muted rounded-full transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="text-sm text-muted-foreground mb-6">
          <p v-if="description" class="mb-2">{{ description }}</p>
          <p>
            To confirm, type <b>{{ entityTitle }}</b> below:
          </p>
        </div>

        <div class="space-y-4">
          <input
            id="confirm-delete-input"
            v-model="confirmText"
            type="text"
            class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-destructive/20 outline-none transition-all"
            :placeholder="entityTitle"
            @keyup.enter="handleConfirm"
          />

          <Button 
            variant="destructive" 
            class="w-full h-12 rounded-xl shadow-md"
            :disabled="confirmText !== entityTitle"
            @click="handleConfirm"
          >
            Confirm Deletion
          </Button>
        </div>
      </div>
    </div>
  </transition>
</template>