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
  <div class="h-full overflow-y-auto bg-background custom-scrollbar pb-24 px-4 pt-6">
    
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
        <button class="p-1 hover:bg-muted rounded-lg transition-colors">
          <PlusCircle class="w-4 h-4 text-primary" />
        </button>
      </div>

      <div class="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
        <div 
          v-for="acc in accounts" 
          :key="acc.id"
          class="snap-start min-w-[160px] bg-card border border-border p-5 rounded-[28px] flex flex-col justify-between h-[140px] shadow-sm relative overflow-hidden"
        >
          <div :class="['w-8 h-8 rounded-xl opacity-20 absolute -right-2 -top-2 scale-150', acc.color]"></div>
          
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{{ acc.title }}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-xl font-black tracking-tighter">{{ acc.amount }}</span>
              <span class="text-xs font-bold text-primary">{{ acc.symbol }}</span>
            </div>
          </div>

          <button class="w-full py-2 bg-muted/50 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-colors">
            Details
          </button>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <span class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Activity Highlights</span>
      
      <div class="grid grid-cols-1 gap-3">
        <div class="bg-card border border-border rounded-[28px] p-5 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-orange-500/10 text-orange-500 rounded-2xl">
              <BarChart3 class="w-6 h-6" />
            </div>
            <div class="flex flex-col">
              <span class="text-xs font-bold text-muted-foreground">Top Category</span>
              <span class="font-black text-sm uppercase tracking-tight">Grocery & Food</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-lg font-black tracking-tighter">32%</span>
            <p class="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">of txs</p>
          </div>
        </div>

        <div class="bg-card border border-border rounded-[28px] p-5 flex items-center gap-4 opacity-60">
           <div class="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <ArrowRightLeft class="w-6 h-6" />
            </div>
            <div class="flex flex-col">
              <span class="text-xs font-bold text-muted-foreground">Internal Transfers</span>
              <span class="font-black text-sm uppercase tracking-tight">8 transactions</span>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
.snap-x {
  scroll-snap-type: x mandatory;
}
</style>


<!-- Счета/Кошельки (Wallet Cards): Ряд карточек, где каждая — это конкретный счет (Cash USD, Tinkoff RUB, Binance BTC). Это база.

Индикаторы по профилям: Раз мы так активно работаем с профилями, важно видеть, в каком ты сейчас.

Статистика по категориям (в процентах): Если мы не можем посчитать общую сумму в валюте, мы можем показать, на что уходит больше всего «штук» (например: 40% транзакций — это Еда, 20% — Транспорт). Это не требует конвертации курсов. -->