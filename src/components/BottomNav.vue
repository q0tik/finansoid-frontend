<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ChartLine, User, Settings, Plus, ArrowLeftRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const router = useRouter()
const route = useRoute()

const items = [
  { name: 'Home',          icon: ChartLine,     route: '/' },
  { name: 'Transactions',  icon: ArrowLeftRight,route: '/transactions' },
  { name: 'Profile',       icon: User,          route: '/profile' },
  { name: 'Settings',      icon: Settings,      route: '/settings' }
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-50">
    
    <div class="bottom-bar-bg bg-card border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.1)] dark:shadow-none transition-colors duration-300">
      
      <div class="flex justify-around items-center h-16 px-4 relative z-10">
        <div class="flex flex-1 justify-around">
          <button v-for="item in items.slice(0, 2)" :key="item.route" @click="router.push(item.route)"
            :class="cn('flex flex-col items-center justify-center w-12 h-12 transition-all', isActive(item.route) ? 'text-primary' : 'text-muted-foreground')">
            <component :is="item.icon" class="w-6 h-6" />
          </button>
        </div>

        <div class="w-20"></div>

        <div class="flex flex-1 justify-around">
          <button v-for="item in items.slice(2)" :key="item.route" @click="router.push(item.route)"
            :class="cn('flex flex-col items-center justify-center w-12 h-12 transition-all', isActive(item.route) ? 'text-primary' : 'text-muted-foreground')">
            <component :is="item.icon" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <button
      @click="router.push(route.path === '/add-transaction' ? '/' : '/add-transaction')"
      :class="cn(
        'absolute left-1/2 -top-6 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-[60] shadow-lg active:scale-95',
        route.path === '/add-transaction' ? 'bg-destructive rotate-45 text-white' : 'bg-primary text-primary-foreground'
      )"
    >
      <Plus class="w-8 h-8" />
    </button>
  </div>
</template>

<style scoped>
.bottom-bar-bg {
  /* Мы используем маску, чтобы "вырезать" полукруг из прямоугольника */
  -webkit-mask: radial-gradient(circle 38px at 50% 0, #0000 98%, #000);
  mask: radial-gradient(circle 38px at 50% 0, #0000 98%, #000);
  /* 38px — это радиус выреза. Подгоняй его под размер кнопки (14*4 = 56px / 2 = 28px + запас) */
}

/* Фикс для iPhone */
.bottom-bar-bg {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>