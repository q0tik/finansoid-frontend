<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Trash2, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, 
  Loader2, Calendar, ArrowUp, Wallet, ChevronDown, Check
} from 'lucide-vue-next'
import { getTransactions } from '@/api/transactions'
import { getAccountsDropdown } from '@/api/accounts'

const route = useRoute()
const router = useRouter()

// Фильтры
const accountId = ref(route.query.account_id || null)
const fromDttm = ref(route.query.from_dttm || '')
const toDttm = ref(route.query.to_dttm || '')

const accounts = ref([])
const transactions = ref([])
const loading = ref(false)
const page = ref(1)
const perPage = 30
const total = ref(0)
const hasMore = ref(true)
const isInitialLoad = ref(true)

// UI состояние для дропдауна
const activeDropdown = ref(null) // 'account' | null
const selectedAccount = computed(() => accounts.value.find(a => a.id === accountId.value))

const scrollComponent = ref(null)
const showScrollTop = ref(false)

const toLocalTime = (utcString) => new Date(utcString)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const handleScroll = (e) => { showScrollTop.value = e.target.scrollTop > 300 }
const scrollToTop = () => { scrollComponent.value?.scrollTo({ top: 0, behavior: 'smooth' }) }

// При выборе аккаунта в кастомном дропдауне
const selectAccount = (id) => {
  accountId.value = id
  activeDropdown.value = null
}

const applyFilters = () => {
  router.replace({
    query: {
      ...route.query,
      account_id: accountId.value || undefined,
      from_dttm: fromDttm.value || undefined,
      to_dttm: toDttm.value || undefined,
    }
  })
  transactions.value = []
  page.value = 1
  hasMore.value = true
  isInitialLoad.value = true
  loadTransactions()
}

watch([accountId, fromDttm, toDttm], applyFilters)

async function loadTransactions() {
  if (loading.value || !hasMore.value) return
  loading.value = true
  if (!isInitialLoad.value) await sleep(800)

  const profileId = localStorage.getItem('active_profile')
  try {
    const res = await getTransactions(
      profileId, 
      page.value, 
      perPage, 
      accountId.value, 
      fromDttm.value, 
      toDttm.value
    )
    if (res.success) {
      transactions.value.push(...res.transactions)
      total.value = res.pagination.total
      if (transactions.value.length >= total.value || res.transactions.length < perPage) {
        hasMore.value = false
      } else {
        page.value++
      }
    }
  } catch (e) { console.error(e) } finally {
    loading.value = false
    isInitialLoad.value = false
  }
}

onMounted(async () => {
  const profileId = localStorage.getItem('active_profile')
  try {
    const accs = await getAccountsDropdown(profileId)
    accounts.value = accs.accounts_short
  } catch (e) { console.error(e) }

  loadTransactions()

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore.value && !loading.value) {
      loadTransactions()
    }
  }, { threshold: 0.1 })

  if (observerTarget.value) observer.observe(observerTarget.value)
})

const groupedTransactions = computed(() => {
  const groups = {}
  transactions.value.forEach(tx => {
    const localDate = toLocalTime(tx.created_at)
    const dateKey = localDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(tx)
  })
  return groups
})

function getTxType(tx) {
  // Если бэк явно говорит, что это трансфер через категорию (is_income === null)
  // или если заполнены оба аккаунта (откуда и куда)
  if (tx.category?.is_income === null || (tx.from_account_id && tx.to_account_id)) {
    return 'transfer'
  }
  if (tx.category?.is_income) return 'income'
  return 'expense'
}

function formatTime(utcString) {
  return toLocalTime(utcString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}
const observerTarget = ref(null)
</script>

<template>
  <div class="flex flex-col h-full bg-background relative overflow-hidden">
    
    <div class="shrink-0 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-4 space-y-3 z-50">
      
      <div class="relative">
        <div 
          @click="activeDropdown = activeDropdown === 'account' ? null : 'account'"
          class="w-full flex items-center justify-between p-3 bg-card border border-border rounded-2xl cursor-pointer hover:border-primary/50 transition-all active:scale-[0.99]"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 text-primary rounded-xl">
              <Wallet class="w-4 h-4" />
            </div>
            <div class="flex flex-col">
              <span class="text-[11px] font-black uppercase tracking-wider leading-none">
                {{ selectedAccount ? selectedAccount.title : 'All Accounts' }}
              </span>
              <span v-if="selectedAccount" class="text-[9px] text-muted-foreground mt-1 font-bold uppercase opacity-60">
                {{ selectedAccount.currency_code }}
              </span>
            </div>
          </div>
          <ChevronDown class="w-4 h-4 text-muted-foreground transition-transform" :class="{ 'rotate-180': activeDropdown === 'account' }" />
        </div>

        <transition name="dropdown">
          <div v-if="activeDropdown === 'account'" class="absolute z-50 w-full mt-2 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden">
            <div class="max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
              <div 
                @click="selectAccount(null)"
                class="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer mb-1"
                :class="{ 'bg-primary/5': accountId === null }"
              >
                <span class="text-[11px] font-bold uppercase tracking-wider" :class="{ 'text-primary': accountId === null }">All Accounts</span>
                <Check v-if="accountId === null" class="w-4 h-4 text-primary" />
              </div>
              
              <div 
                v-for="a in accounts" :key="a.id"
                @click="selectAccount(a.id)"
                class="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer mb-1 last:mb-0"
                :class="{ 'bg-primary/5': accountId === a.id }"
              >
                <div class="flex flex-col">
                  <span class="text-[11px] font-bold uppercase tracking-wider" :class="{ 'text-primary': accountId === a.id }">{{ a.title }}</span>
                  <span class="text-[9px] text-muted-foreground font-bold uppercase opacity-60">{{ a.currency_code }}</span>
                </div>
                <Check v-if="accountId === a.id" class="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-1">
          <label class="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-50 ml-2">From Date</label>
          <input 
            type="datetime-local" 
            v-model="fromDttm"
            class="bg-muted/40 border border-border/50 rounded-xl px-3 py-2 text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-50 ml-2">To Date</label>
          <input 
            type="datetime-local" 
            v-model="toDttm"
            class="bg-muted/40 border border-border/50 rounded-xl px-3 py-2 text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </div>

    <Transition name="fade-pop">
      <button v-if="showScrollTop" @click="scrollToTop" class="absolute bottom-28 right-6 z-[70] w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform border-4 border-background">
        <ArrowUp class="w-6 h-6" />
      </button>
    </Transition>

    <div ref="scrollComponent" @scroll="handleScroll" class="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 pb-24">
      <div v-for="(items, date) in groupedTransactions" :key="date" class="mb-6">
        <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2 mb-1">
          <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center gap-2">
            <Calendar class="w-3 h-3" />
            {{ date }}
          </h3>
        </div>

        <div class="bg-card border border-border/40 rounded-[24px] divide-y divide-border/20 overflow-hidden shadow-sm">
          <div v-for="tx in items" :key="tx.id" class="group flex items-center justify-between p-4 active:bg-muted/50 transition-colors">
            <div class="flex items-center gap-4 min-w-0">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                getTxType(tx) === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 
                getTxType(tx) === 'expense' ? 'bg-red-500/10 text-red-500' : 
                'bg-blue-500/10 text-blue-500'
              ]">
                <ArrowDownLeft v-if="getTxType(tx) === 'income'" class="w-5 h-5" />
                <ArrowUpRight v-else-if="getTxType(tx) === 'expense'" class="w-5 h-5" />
                <ArrowLeftRight v-else class="w-4 h-4" />
              </div>
              <div class="flex flex-col min-w-0">
                <span class="font-bold text-[15px] leading-tight truncate text-foreground">{{ getTxType(tx) === 'transfer' ? 'Transfer' : (tx.category?.title || 'Other') }}</span>
                <span class="text-[11px] font-medium text-muted-foreground/60 mt-0.5 truncate">{{ formatTime(tx.created_at) }} <span v-if="tx.comment" class="opacity-50">• {{ tx.comment }}</span></span>
              </div>
            </div>
            <div class="flex items-center gap-3 shrink-0 text-right">
              <div :class="['font-black text-base', getTxType(tx) === 'income' ? 'text-emerald-500' : getTxType(tx) === 'expense' ? 'text-red-500' : 'text-foreground']">
                {{ getTxType(tx) === 'income' ? '+' : getTxType(tx) === 'expense' ? '-' : '' }}{{ tx.amount }} {{ tx.currency_to_symbol }}
              </div>
              <button @click="alert('Delete?')" class="p-2 -mr-2 text-muted-foreground/10 group-hover:text-red-500/50 hover:!text-red-500 transition-colors">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div ref="observerTarget" class="py-6 flex flex-col items-center justify-center">
        <div v-if="loading && !isInitialLoad" class="flex flex-col items-center gap-2">
          <Loader2 class="w-6 h-6 animate-spin text-primary" />
          <span class="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Loading more...</span>
        </div>
        <div v-else-if="loading && isInitialLoad" class="py-20">
          <Loader2 class="w-8 h-8 animate-spin text-primary opacity-20" />
        </div>
        <div v-else-if="!hasMore && transactions.length > 0" class="flex flex-col items-center gap-2 opacity-20">
           <div class="w-1 h-1 bg-foreground rounded-full"></div>
           <span class="text-[9px] font-black uppercase tracking-[0.3em]">All transactions loaded</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 0px; }
.mb-6 { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

/* Анимации дропдауна */
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-10px) scale(0.98); }

.fade-pop-enter-active, .fade-pop-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.fade-pop-enter-from, .fade-pop-leave-to { opacity: 0; transform: scale(0.5) translateY(20px); }

input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg);
  opacity: 0.5;
}
</style>