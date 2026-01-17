<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'

const route = useRoute()

// Глобальная функция, которая меняет атрибуты в DOM
const applyTheme = (themeName) => {
  document.documentElement.classList.remove('dark')
  document.documentElement.removeAttribute('data-theme')

  if (themeName === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (themeName !== 'light') {
    document.documentElement.setAttribute('data-theme', themeName)
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('user-theme') || 'light'
  applyTheme(savedTheme)
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background text-foreground transition-colors">
    <main class="flex-1 overflow-y-auto">
      <router-view />
    </main>
    <BottomNav v-if="!route.meta.hideFooter" />
  </div>
</template>