<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { getAccountsDropdown } from '@/api/accounts'
import { getCategories } from '@/api/categories'
import { createTransaction } from '@/api/transactions'
import { ChevronDown, Check, Wallet, Tag, MessageSquare, Loader2, TrendingUp } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
// 1. Импортируем тост
import SuccessToast from '@/components/ui/SuccessToast.vue'

const showToast = ref(false)
const LAST_ACCOUNT_KEY_INCOME = 'last_selected_account_income'

const amount = ref('')
const categoryId = ref('')
const toAccountId = ref('')
const comment = ref('')

const categories = ref([])
const accounts = ref([])
const loading = ref(false)
const activeDropdown = ref(null)

const selectedAccount = computed(() => accounts.value.find(a => a.id === toAccountId.value))
const selectedCategory = computed(() => categories.value.find(c => c.id === categoryId.value))
const accountSymbol = computed(() => selectedAccount.value?.currency_symbol || '')

async function loadData() {
  loading.value = true
  const profileId = localStorage.getItem('active_profile')
  try {
    const [cats, accs] = await Promise.all([
      getCategories(profileId, 1, 100, true), 
      getAccountsDropdown(profileId),
    ])
    categories.value = cats.categories
    accounts.value = accs.accounts_short
    
    const saved = localStorage.getItem(LAST_ACCOUNT_KEY_INCOME)
    if (saved && accounts.value.some(a => a.id === saved)) {
      toAccountId.value = saved
    } else if (accounts.value.length > 0) {
      toAccountId.value = accounts.value[0].id
    }
  } catch (e) {
    console.error("Failed to load data", e)
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (!amount.value || !categoryId.value || !toAccountId.value) return
  try {
    await createTransaction(
      amount.value.toString(),
      categoryId.value,
      null,
      toAccountId.value,
      null,
      comment.value || null,
    )
    
    // 2. Показываем успех и сбрасываем поля
    showToast.value = true
    amount.value = ''
    comment.value = ''
    
  } catch (e) {
    console.error(e)
    // Здесь можно будет потом добавить ErrorToast, если захочешь
  }
}

const selectCategory = (id) => {
  categoryId.value = id
  activeDropdown.value = null
}

const selectAccount = (id) => {
  toAccountId.value = id
  activeDropdown.value = null
  localStorage.setItem(LAST_ACCOUNT_KEY_INCOME, id)
}

onMounted(loadData)
</script>

<template>
  <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-muted-foreground">
    <Loader2 class="w-8 h-8 animate-spin mb-2" />
    <span class="text-sm text-emerald-500/50">Loading income categories...</span>
  </div>

  <form v-else @submit.prevent="handleSubmit" class="space-y-6 pt-2">
    <div class="relative group">
      <div 
        class="bg-card border-2 border-border rounded-3xl p-6 transition-all duration-300 group-within:border-emerald-500/40 group-within:shadow-[0_0_20px_rgba(16,185,129,0.05)]"
      >
        <div class="flex items-center justify-center gap-3">
          <input
            v-model="amount"
            type="number"
            step="0.01"
            inputmode="decimal"
            placeholder="0.00"
            class="w-full bg-transparent text-5xl font-black text-right outline-none placeholder:text-muted-foreground/20 focus:placeholder:text-transparent transition-all min-w-[100px]"
          />
          <div class="flex flex-col items-start min-w-[50px] border-l border-border pl-3">
            <span 
              class="text-3xl font-bold transition-colors leading-none"
              :class="amount ? 'text-emerald-500' : 'text-muted-foreground/30'"
            >
              {{ accountSymbol || '•' }}
            </span>
          </div>
        </div>
      </div>
      <div v-if="amount" class="absolute -inset-1 bg-emerald-500/5 blur-2xl -z-10 rounded-3xl transition-opacity"></div>
    </div>

    <div class="space-y-3">
      <div class="relative">
        <label class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-4 mb-1 block opacity-60">Category</label>
        <div 
          @click="activeDropdown = activeDropdown === 'category' ? null : 'category'"
          class="w-full flex items-center justify-between p-4 bg-card border border-border rounded-2xl cursor-pointer hover:border-emerald-500/30 transition-all active:scale-[0.99]"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <TrendingUp class="w-5 h-5" />
            </div>
            <span v-if="selectedCategory" class="font-bold">{{ selectedCategory.title }}</span>
            <span v-else class="text-muted-foreground">Source of income</span>
          </div>
          <ChevronDown class="w-5 h-5 text-muted-foreground transition-transform duration-300" :class="{ 'rotate-180': activeDropdown === 'category' }" />
        </div>

        <transition name="dropdown">
          <div v-if="activeDropdown === 'category'" class="absolute z-50 w-full mt-2 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden">
            <div class="max-h-[200px] overflow-y-auto p-1 custom-scrollbar">
              <div 
                v-for="c in categories" :key="c.id"
                @click="selectCategory(c.id)"
                class="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer mb-1"
                :class="{ 'bg-emerald-500/5': categoryId === c.id }"
              >
                <span :class="{ 'font-bold text-emerald-600': categoryId === c.id }">{{ c.title }}</span>
                <Check v-if="categoryId === c.id" class="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="relative">
        <label class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-4 mb-1 block opacity-60">To Account</label>
        <div 
          @click="activeDropdown = activeDropdown === 'account' ? null : 'account'"
          class="w-full flex items-center justify-between p-4 bg-card border border-border rounded-2xl cursor-pointer hover:border-emerald-500/30 transition-all active:scale-[0.99]"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 text-primary rounded-xl">
              <Wallet class="w-5 h-5" />
            </div>
            <div v-if="selectedAccount" class="flex flex-col">
              <span class="font-bold leading-none">{{ selectedAccount.title }}</span>
              <span class="text-[10px] text-muted-foreground mt-1 uppercase font-black opacity-60">{{ selectedAccount.currency_symbol }}</span>
            </div>
            <span v-else class="text-muted-foreground">Target account</span>
          </div>
          <ChevronDown class="w-5 h-5 text-muted-foreground transition-transform duration-300" :class="{ 'rotate-180': activeDropdown === 'account' }" />
        </div>

        <transition name="dropdown">
          <div v-if="activeDropdown === 'account'" class="absolute z-40 w-full mt-2 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden">
            <div class="max-h-[200px] overflow-y-auto p-1 custom-scrollbar">
              <div 
                v-for="a in accounts" :key="a.id"
                @click="selectAccount(a.id)"
                class="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer mb-1"
                :class="{ 'bg-primary/5': toAccountId === a.id }"
              >
                <div class="flex flex-col">
                  <span :class="{ 'font-bold text-primary': toAccountId === a.id }">{{ a.title }}</span>
                  <span class="text-[10px] text-muted-foreground uppercase font-black opacity-60">{{ a.currency_code }}</span>
                </div>
                <Check v-if="toAccountId === a.id" class="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="space-y-1">
        <label class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-4 block opacity-60">Comment</label>
        <div class="relative">
          <div class="absolute left-4 top-4 text-muted-foreground/50">
            <MessageSquare class="w-5 h-5" />
          </div>
          <textarea
            v-model="comment"
            rows="1"
            placeholder="Bonus or freelance pay..."
            class="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
          ></textarea>
        </div>
      </div>
    </div>

    <Button
      type="submit"
      class="w-full h-16 text-lg font-black rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/10 active:scale-[0.97] transition-all mt-4"
      :disabled="!amount || !categoryId || !toAccountId"
    >
      Add Income
    </Button>

    <SuccessToast 
      :show="showToast" 
      message="Income added successfully!" 
      @close="showToast = false" 
    />
  </form>
</template>