<script setup>
import { ref, onMounted } from 'vue'
import { Trash2, Plus, Loader2, Coins } from 'lucide-vue-next'
import { getCurrencies, createCurrency, deleteCurrency } from '@/api/currencies'
import { Button } from '@/components/ui/button'

// Импортируем компоненты
import AddCurrencyModal from '@/components/AddCurrencyModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const currencies = ref([])
const loading = ref(false)
const isFetchingMore = ref(false)
const allLoaded = ref(false)
const page = ref(1)
const perPage = 10 // Валют обычно немного, можно грузить пачками побольше

// Модалки
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const itemToDelete = ref(null)

// --- Логика загрузки (Infinite Scroll) ---
async function loadCurrencies(append = false) {
  const profileId = localStorage.getItem('active_profile')
  if (!append) loading.value = true
  
  const response = await getCurrencies(profileId, append ? page.value + 1 : 1, perPage)
  
  if (response.success) {
    if (append) {
      currencies.value = [...currencies.value, ...response.currencies]
      page.value++
    } else {
      currencies.value = response.currencies
      page.value = 1
    }
    
    if (response.currencies.length < perPage) allLoaded.value = true
  }
  loading.value = false
  isFetchingMore.value = false
}

async function handleScroll(event) {
  const { scrollTop, scrollHeight, clientHeight } = event.target
  if (scrollTop + clientHeight >= scrollHeight - 20 && !isFetchingMore.value && !allLoaded.value) {
    isFetchingMore.value = true
    await loadCurrencies(true)
  }
}

// --- Логика создания ---
async function handleAdd(data) {
  await createCurrency(
    data.profile_id,
    data.title,
    data.code,
    data.symbol,
    data.decimal_digits
  )
  allLoaded.value = false
  await loadCurrencies(false)
}

// --- Логика удаления (через ConfirmModal) ---
function openDeleteModal(currency) {
  itemToDelete.value = currency
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (itemToDelete.value) {
    await deleteCurrency(itemToDelete.value.id)
    allLoaded.value = false
    await loadCurrencies(false)
  }
  showDeleteModal.value = false
}

onMounted(() => loadCurrencies())
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading && currencies.length === 0" class="space-y-2">
      <div v-for="i in 3" :key="i" class="h-16 w-full bg-muted animate-pulse rounded-xl"></div>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div 
        @scroll="handleScroll"
        class="max-h-[350px] overflow-y-auto pr-1 space-y-2 custom-scrollbar"
      >
        <div 
          v-for="c in currencies" 
          :key="c.id"
          class="flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 hover:bg-card/60 transition-all"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-orange-500/10 text-orange-500">
              <Coins class="w-4 h-4" />
            </div>
            <div class="flex flex-col">
              <span class="font-semibold text-sm">{{ c.title }}</span>
              <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <span class="font-mono bg-muted px-1 rounded">{{ c.code }}</span>
                <span>•</span>
                <span>{{ c.decimals }} decimals</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-lg font-bold font-mono text-primary/80">{{ c.symbol }}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              class="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              @click="openDeleteModal(c)"
            >
              <Trash2 class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div v-if="isFetchingMore" class="flex justify-center py-2">
          <Loader2 class="w-5 h-5 animate-spin text-primary" />
        </div>
      </div>

      <Button 
        variant="outline" 
        class="w-full h-12 border-dashed border-2 gap-2 text-muted-foreground hover:text-primary rounded-xl"
        @click="showAddModal = true"
      >
        <Plus class="w-4 h-4" /> Add Currency
      </Button>
    </div>

    <AddCurrencyModal 
      :show="showAddModal" 
      @close="showAddModal = false" 
      @created="handleAdd" 
    />

    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Currency?"
      :description="`Are you sure you want to delete ${itemToDelete?.code}? This might affect accounts using this currency.`"
      confirm-text="Delete"
      danger
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>