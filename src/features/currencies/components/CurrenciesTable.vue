<script setup>
import { ref } from 'vue'
import { Trash2, Plus, Loader2, Coins } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useCurrencies } from '@/features/currencies/composables/useCurrencies'
import { useDefaultTitles } from '@/composables/useDefaultTitles'
import AddCurrencyModal from './AddCurrencyModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const { currencyTitle } = useDefaultTitles()
const { currencies, loading, isFetchingMore, handleScroll, create, remove } = useCurrencies()

// Modal state (UI concern, stays in component)
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const itemToDelete = ref(null)

function openDeleteModal(currency) {
  itemToDelete.value = currency
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (itemToDelete.value) await remove(itemToDelete.value.id)
  showDeleteModal.value = false
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading && currencies.length === 0" class="space-y-2">
      <div v-for="i in 3" :key="i" class="h-16 w-full bg-muted animate-pulse rounded-xl"></div>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div @scroll="handleScroll" class="max-h-[350px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
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
              <span class="font-semibold text-sm">{{ currencyTitle(c) }}</span>
              <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <span class="font-mono bg-muted px-1 rounded">{{ c.code }}</span>
                <span>•</span>
                <span>{{ c.decimals }} {{ $t('common.decimals') }}</span>
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
        <Plus class="w-4 h-4" /> {{ $t('currency.add') }}
      </Button>
    </div>

    <AddCurrencyModal :show="showAddModal" @close="showAddModal = false" @created="create" />
    <ConfirmModal
      :show="showDeleteModal"
      :title="$t('currency.delete_title')"
      :description="$t('currency.delete_desc', { code: itemToDelete?.code })"
      :confirm-text="$t('common.delete')"
      danger
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
</style>
