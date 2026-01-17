<script setup>
import { Check } from 'lucide-vue-next'
import { onMounted } from 'vue'

const props = defineProps({
  modelValue: String,
  themes: Array
})

const emit = defineEmits(['update:modelValue'])

const themeColors = {
  light: 'bg-white border-gray-200',
  dark: 'bg-slate-900 border-slate-800',
  mint: 'bg-[#f5fff9] border-[#d1f2e1]',
  desert: 'bg-[#fffaf0] border-[#f0e4d0]'
}

const setTheme = (theme) => {
  emit('update:modelValue', theme)
  
  // Сохраняем выбор пользователя
  localStorage.setItem('user-theme', theme)

  document.documentElement.classList.remove('dark')
  document.documentElement.removeAttribute('data-theme')

  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (theme !== 'light') {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

// ... твои props, emit и themeColors ...

onMounted(() => {
  // 1. Проверяем data-theme (для mint, desert и т.д.)
  const activeDataTheme = document.documentElement.getAttribute('data-theme')
  
  // 2. Проверяем класс dark
  const isDark = document.documentElement.classList.contains('dark')

  let currentTheme = 'light'
  
  if (activeDataTheme) {
    currentTheme = activeDataTheme
  } else if (isDark) {
    currentTheme = 'dark'
  }

  // 3. Сообщаем родителю, что текущая выбранная тема — вот эта
  // Это синхронизирует галочку в интерфейсе при заходе на страницу
  if (props.modelValue !== currentTheme) {
    emit('update:modelValue', currentTheme)
  }
})
</script>

<template>
  <div class="grid grid-cols-2 gap-3 p-1">
    <button
      v-for="theme in themes"
      :key="theme"
      @click="setTheme(theme)"
      class="relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all active:scale-95"
      :class="[
        modelValue === theme 
          ? 'border-primary bg-primary/5' 
          : 'border-border bg-card hover:border-primary/30'
      ]"
    >
      <div 
        class="w-6 h-6 rounded-full border shadow-sm shrink-0"
        :class="themeColors[theme]"
      ></div>
      
      <span class="text-sm font-medium capitalize flex-1 text-left">
        {{ theme }}
      </span>

      <Check 
        v-if="modelValue === theme" 
        class="w-4 h-4 text-primary shrink-0" 
      />
    </button>
  </div>
</template>