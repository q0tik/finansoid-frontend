<script setup>
import { CheckCircle2, AlertCircle } from 'lucide-vue-next' // Добавили AlertCircle
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  show: Boolean,
  message: String,
  type: {
    type: String,
    default: 'success' // 'success' или 'error'
  }
})

const emit = defineEmits(['close'])
let timer = null

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      emit('close')
    }, 2000) // Увеличил до 2с, чтобы успели прочитать ошибку
  }
})

onUnmounted(() => { if (timer) clearTimeout(timer) })
</script>

<template>
  <transition name="toast">
    <div v-if="show" class="toast-container">
      <div class="toast-content" :class="type === 'error' ? 'bg-destructive' : 'bg-emerald-500'">
        <CheckCircle2 v-if="type === 'success'" class="w-5 h-5 shrink-0" />
        <AlertCircle v-else class="w-5 h-5 shrink-0" />
        <span class="font-bold text-sm leading-none">{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000; /* Выше всех модалок */
  pointer-events: none;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  color: white;
  border-radius: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  pointer-events: auto;
}

/* Tailwind-like цвета, если нет глобальных стилей */
.bg-emerald-500 { background-color: #10b981; }
.bg-destructive { background-color: #ef4444; }

.toast-enter-active { animation: toast-in 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards; }
.toast-leave-active { animation: toast-out 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards; }

@keyframes toast-in {
  0% { transform: translate(-50%, -100px) scale(0.9); opacity: 0; }
  100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
}
@keyframes toast-out {
  0% { transform: translate(-50%, 0) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -20px) scale(0.8); opacity: 0; }
}
</style>