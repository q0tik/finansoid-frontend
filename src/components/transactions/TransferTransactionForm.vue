<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { getAccountsDropdown } from '@/api/accounts'
import { createTransaction } from '@/api/transactions'
import { ChevronDown, Check, Wallet, ArrowDownUp, RefreshCw, MessageSquare, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import SuccessToast from '@/components/ui/SuccessToast.vue' // 1. ИМПОРТ

const showToast = ref(false) // 2. СОСТОЯНИЕ

// State
const amount = ref('')          // Сколько отправляем
const receivedAmount = ref('')  // Сколько получаем
const exchangeRate = ref('')    // Курс

const fromAccountId = ref('')
const toAccountId = ref('')
const comment = ref('')

const accounts = ref([])
const loading = ref(false)
const activeDropdown = ref(null)

// Computed
const fromAccount = computed(() => accounts.value.find(a => a.id === fromAccountId.value))
const toAccount = computed(() => accounts.value.find(a => a.id === toAccountId.value))

// --- ЛОГИКА: СРАВНИВАЕМ ПО СИМВОЛАМ ---
const needsExchange = computed(() => {
  if (!fromAccount.value || !toAccount.value) return false
  const sym1 = fromAccount.value.currency_symbol || ''
  const sym2 = toAccount.value.currency_symbol || ''
  return sym1 !== sym2
})

// Загрузка данных
async function loadData() {
  loading.value = true
  const profileId = localStorage.getItem('active_profile')
  try {
    const res = await getAccountsDropdown(profileId)
    accounts.value = res.accounts_short
    if (accounts.value.length > 0) fromAccountId.value = accounts.value[0].id
    if (accounts.value.length > 1) toAccountId.value = accounts.value[1].id
  } finally {
    loading.value = false
  }
}

// === КАЛЬКУЛЯТОР ОБМЕНА ===
const updateReceived = () => {
  if (!needsExchange.value) return
  if (!amount.value || !exchangeRate.value) {
    if (!exchangeRate.value) receivedAmount.value = ''
    return
  }
  const val = parseFloat(amount.value) * parseFloat(exchangeRate.value)
  receivedAmount.value = val.toFixed(2)
}

const onRateInput = () => {
  updateReceived()
}

const onReceivedInput = () => {
  if (!amount.value || !receivedAmount.value || parseFloat(amount.value) === 0) return
  const rate = parseFloat(receivedAmount.value) / parseFloat(amount.value)
  exchangeRate.value = rate.toFixed(6)
}

const swapAccounts = () => {
  const temp = fromAccountId.value
  fromAccountId.value = toAccountId.value
  toAccountId.value = temp
  exchangeRate.value = ''
  receivedAmount.value = ''
}

const selectFrom = (id) => {
  if (id === toAccountId.value) toAccountId.value = fromAccountId.value
  fromAccountId.value = id
  activeDropdown.value = null
  exchangeRate.value = ''
  receivedAmount.value = ''
}
const selectTo = (id) => {
  if (id === fromAccountId.value) fromAccountId.value = toAccountId.value
  toAccountId.value = id
  activeDropdown.value = null
  exchangeRate.value = ''
  receivedAmount.value = ''
}

async function handleSubmit() {
  if (!amount.value || !fromAccountId.value || !toAccountId.value) return
  const finalRate = needsExchange.value ? exchangeRate.value : '1'
  if (needsExchange.value && !finalRate) {
    alert('Please specify exchange rate or received amount')
    return
  }
  try {
    await createTransaction(
      amount.value.toString(),
      null, 
      fromAccountId.value,
      toAccountId.value,
      finalRate.toString(),
      comment.value || null,
    )
    
    showToast.value = true // 3. ВКЛЮЧАЕМ ТОСТ
    
    amount.value = ''
    receivedAmount.value = ''
    exchangeRate.value = ''
    comment.value = ''
  } catch (e) {
    alert('Error creating transfer')
  }
}

onMounted(loadData)
</script>

<template>
  <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-muted-foreground">
    <Loader2 class="w-8 h-8 animate-spin mb-2" />
    <span class="text-sm">Loading accounts...</span>
  </div>

  <form v-else @submit.prevent="handleSubmit" class="space-y-6 pt-2">
    <div class="relative group">
      <div class="bg-card border-2 border-border rounded-3xl p-6 transition-all duration-300 group-within:border-blue-500/40 group-within:shadow-[0_0_20px_rgba(59,130,246,0.05)]">
        <label class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 block text-center mb-2">
          Sending Amount
        </label>
        <div class="flex items-center justify-center gap-3">
          <input
            v-model="amount"
            @input="updateReceived"
            type="number"
            step="0.01"
            inputmode="decimal"
            placeholder="0.00"
            class="w-full bg-transparent text-5xl font-black text-right outline-none placeholder:text-muted-foreground/20 focus:placeholder:text-transparent transition-all min-w-[100px]"
          />
          <div class="flex flex-col items-start min-w-[50px] border-l border-border pl-3">
            <span 
              class="text-3xl font-bold transition-colors duration-300 leading-none"
              :class="amount ? 'text-blue-500' : 'text-muted-foreground/30'"
            >
              {{ fromAccount?.currency_symbol || '•' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-1 relative">
      <div class="absolute left-8 top-10 bottom-10 w-0.5 bg-border -z-10 border-l-2 border-dashed border-muted"></div>

      <div class="relative">
        <div 
          @click="activeDropdown = activeDropdown === 'from' ? null : 'from'"
          class="w-full flex items-center justify-between p-4 bg-card border border-border rounded-2xl cursor-pointer hover:border-blue-500/30 transition-all active:scale-[0.99]"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-500/10 text-blue-500 rounded-xl font-bold text-xs uppercase">From</div>
            <div v-if="fromAccount" class="flex flex-col">
              <span class="font-bold leading-none">{{ fromAccount.title }}</span>
              <span class="text-[10px] text-muted-foreground mt-1 uppercase font-black opacity-60">
                {{ fromAccount.currency_symbol }}
              </span>
            </div>
            <span v-else class="text-muted-foreground">Select source</span>
          </div>
          <ChevronDown class="w-5 h-5 text-muted-foreground" />
        </div>

        <transition name="dropdown">
          <div v-if="activeDropdown === 'from'" class="absolute z-50 w-full mt-2 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden">
             <div class="max-h-[200px] overflow-y-auto p-1 custom-scrollbar">
              <div 
                v-for="a in accounts" :key="a.id"
                @click="selectFrom(a.id)"
                class="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer mb-1"
                :class="{ 'bg-blue-500/5': fromAccountId === a.id, 'opacity-50': toAccountId === a.id }"
              >
                <div class="flex flex-col">
                  <span :class="{ 'font-bold text-blue-600': fromAccountId === a.id }">{{ a.title }}</span>
                  <span class="text-[10px] text-muted-foreground uppercase font-black opacity-60">{{ a.currency_symbol }}</span>
                </div>
                <Check v-if="fromAccountId === a.id" class="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="flex justify-center -my-3 z-10 relative">
        <button 
          type="button" 
          @click="swapAccounts"
          class="bg-background border border-border p-2 rounded-full shadow-sm hover:scale-110 active:scale-90 transition-transform text-muted-foreground hover:text-primary"
        >
          <ArrowDownUp class="w-4 h-4" />
        </button>
      </div>

      <div class="relative">
        <div 
          @click="activeDropdown = activeDropdown === 'to' ? null : 'to'"
          class="w-full flex items-center justify-between p-4 bg-card border border-border rounded-2xl cursor-pointer hover:border-purple-500/30 transition-all active:scale-[0.99]"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-purple-500/10 text-purple-500 rounded-xl font-bold text-xs uppercase">To</div>
            <div v-if="toAccount" class="flex flex-col">
              <span class="font-bold leading-none">{{ toAccount.title }}</span>
              <span class="text-[10px] text-muted-foreground mt-1 uppercase font-black opacity-60">
                {{ toAccount.currency_symbol }}
              </span>
            </div>
            <span v-else class="text-muted-foreground">Select target</span>
          </div>
          <ChevronDown class="w-5 h-5 text-muted-foreground" />
        </div>

        <transition name="dropdown">
           <div v-if="activeDropdown === 'to'" class="absolute z-40 w-full mt-2 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden">
             <div class="max-h-[200px] overflow-y-auto p-1 custom-scrollbar">
              <div 
                v-for="a in accounts" :key="a.id"
                @click="selectTo(a.id)"
                class="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer mb-1"
                :class="{ 'bg-purple-500/5': toAccountId === a.id, 'opacity-50': fromAccountId === a.id }"
              >
                <div class="flex flex-col">
                  <span :class="{ 'font-bold text-purple-600': toAccountId === a.id }">{{ a.title }}</span>
                  <span class="text-[10px] text-muted-foreground uppercase font-black opacity-60">{{ a.currency_symbol }}</span>
                </div>
                <Check v-if="toAccountId === a.id" class="w-4 h-4 text-purple-500" />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <transition name="slide-fade">
      <div v-if="needsExchange" class="bg-muted/30 border border-border/50 rounded-2xl p-4 space-y-4">
        <div class="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          <RefreshCw class="w-3 h-3" />
          <span>Currency Exchange</span>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-muted-foreground ml-1">
              Rate (1 {{ fromAccount?.currency_symbol }} =)
            </label>
            <input 
              v-model="exchangeRate"
              @input="onRateInput"
              type="number" 
              step="0.000001"
              placeholder="0.00"
              class="w-full px-3 py-3 bg-card border border-border rounded-xl font-bold text-sm outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-muted-foreground ml-1">
              Received ({{ toAccount?.currency_symbol }})
            </label>
            <div class="relative">
              <input 
                v-model="receivedAmount"
                @input="onReceivedInput"
                type="number" 
                step="0.01"
                placeholder="0.00"
                class="w-full px-3 py-3 bg-card border border-border rounded-xl font-bold text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="space-y-1">
      <div class="relative">
        <div class="absolute left-4 top-4 text-muted-foreground/50">
          <MessageSquare class="w-5 h-5" />
        </div>
        <textarea
          v-model="comment"
          rows="1"
          placeholder="Transfer comment..."
          class="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-none"
        ></textarea>
      </div>
    </div>

    <Button
      type="submit"
      class="w-full h-16 text-lg font-black rounded-2xl shadow-xl active:scale-[0.97] transition-all mt-4"
      :class="needsExchange ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' : 'bg-primary hover:bg-primary/90'"
      :disabled="!amount || !fromAccountId || !toAccountId"
    >
      Transfer Money
    </Button>

    <SuccessToast 
      :show="showToast" 
      message="Transfer successful!" 
      @close="showToast = false" 
    />
  </form>
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-12px) scale(0.98); }
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-10px); opacity: 0; }
input[type=number] { -moz-appearance: textfield; }
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--muted-foreground) / 0.2); border-radius: 10px; }
</style>