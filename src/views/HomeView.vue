<script setup>
import { ref, onMounted } from 'vue'
import { 
  Wallet, 
  CreditCard, 
  ArrowRightLeft,
  ChevronRight,
  PlusCircle,
  BarChart3
} from 'lucide-vue-next'
import { useProfileStore } from '@/stores/profileStore'

const store = useProfileStore()
const accounts = ref([
  { id: 1, title: 'Cash', amount: '1,200', symbol: '$', color: 'bg-emerald-500' },
  { id: 2, title: 'Crypto', amount: '0.45', symbol: 'BTC', color: 'bg-orange-500' },
  { id: 3, title: 'Stocks', amount: '150', symbol: 'APPL', color: 'bg-blue-500' },
])

onMounted(async () => {
  // Тут будет загрузка реальных счетов через store.activeProfile
})
</script>

<template>
  <div class="h-full w-full relative overflow-hidden bg-background">
    
    <div class="h-full w-full overflow-y-auto custom-scrollbar pb-24 px-4 pt-6 blur-[8px] opacity-40 pointer-events-none">
      <div class="flex items-center justify-between mb-8">
        <div class="flex flex-col">
          <h1 class="text-2xl font-black tracking-tight leading-none mb-1">Assets</h1>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
            Profile: {{ store.profiles.find(p => p.id === store.activeProfile)?.title || 'Default' }}
          </p>
        </div>
        <div class="p-3 bg-card border border-border rounded-2xl">
          <Wallet class="w-5 h-5 text-primary" />
        </div>
      </div>

      <div class="mb-10">
        <div class="flex items-center justify-between mb-4 px-1">
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">My Wallets</span>
          <PlusCircle class="w-4 h-4 text-primary" />
        </div>
        <div class="flex gap-4 overflow-x-auto pb-4">
          <div v-for="acc in accounts" :key="acc.id" class="min-w-[160px] bg-card border border-border p-5 rounded-[28px] h-[140px]"></div>
        </div>
      </div>

      <div class="space-y-4">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Activity Highlights</span>
        <div class="bg-card border border-border rounded-[28px] p-5 h-24 w-full"></div>
        <div class="bg-card border border-border rounded-[28px] p-5 h-24 w-full"></div>
      </div>
    </div>

<div class="fixed inset-0 z-[60] flex items-center justify-center p-6 pb-24 pointer-events-none">
  
  <div class="w-full max-w-[280px] bg-card/60 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] flex flex-col items-center text-center animate-in fade-in zoom-in duration-500 pointer-events-auto">
    
    <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
      <BarChart3 class="w-7 h-7 text-primary animate-pulse" />
    </div>
    
    <h2 class="text-2xl font-black italic tracking-tighter mb-2 text-white italic">Coming Soon</h2>
    
    <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.12em] leading-relaxed">
      The Assets & Portfolio <br/> management is currently <br/> under development.
    </p>
    
    <div class="mt-6 pt-4 border-t border-white/5 w-full">
      <p class="text-[9px] font-black uppercase tracking-[0.3em] text-primary/40">
        Finansoid System
      </p>
    </div>
  </div>
</div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Чтобы точно ничего не дергалось */
.fixed {
  transform: translateZ(0);
}
</style>


<!-- Счета/Кошельки (Wallet Cards): Ряд карточек, где каждая — это конкретный счет (Cash USD, Tinkoff RUB, Binance BTC). Это база.

Индикаторы по профилям: Раз мы так активно работаем с профилями, важно видеть, в каком ты сейчас.

Статистика по категориям (в процентах): Если мы не можем посчитать общую сумму в валюте, мы можем показать, на что уходит больше всего «штук» (например: 40% транзакций — это Еда, 20% — Транспорт). Это не требует конвертации курсов. -->