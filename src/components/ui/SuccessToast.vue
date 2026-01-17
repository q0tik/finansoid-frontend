<script setup>
import { CheckCircle2 } from 'lucide-vue-next'
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  show: Boolean,
  message: String
})

const emit = defineEmits(['close'])

let timer = null

// Следим за появлением тоста
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Если есть старый таймер — сбрасываем
    if (timer) clearTimeout(timer)
    
    // Запускаем новый отсчет на закрытие
    timer = setTimeout(() => {
      emit('close')
    }, 1500)
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <transition name="toast">
    <div v-if="show" class="toast-container">
      <div class="toast-content">
        <CheckCircle2 class="w-5 h-5 shrink-0" />
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
  z-index: 1000;
  pointer-events: none;
}

.toast-content {
  display: flex;
  align-items: center; /* ИСПРАВЛЕНО: было items-center */
  gap: 12px;
  padding: 16px 24px;
  background-color: #10b981; /* emerald-500 */
  color: white;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.2), 0 8px 10px -6px rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
  pointer-events: auto;
}

/* АНИМАЦИИ */
.toast-enter-active {
  animation: toast-in 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
}

.toast-leave-active {
  animation: toast-out 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
}

@keyframes toast-in {
  0% { 
    transform: translate(-50%, -100px) scale(0.9);
    opacity: 0;
  }
  100% { 
    transform: translate(-50%, 0) scale(1);
    opacity: 1;
  }
}

@keyframes toast-out {
  0% { 
    transform: translate(-50%, 0) scale(1);
    opacity: 1;
  }
  100% { 
    transform: translate(-50%, -20px) scale(0.8);
    opacity: 0;
  }
}
</style>