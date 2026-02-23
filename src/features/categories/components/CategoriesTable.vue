<script setup>
import { ref, computed } from 'vue'
import { Trash2, Plus, Loader2, TrendingUp, TrendingDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'
import { useCategories } from '@/features/categories/composables/useCategories'
import { useDefaultTitles } from '@/composables/useDefaultTitles'
import AddCategoryModal from './AddCategoryModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const { t } = useI18n()
const { categoryTitle } = useDefaultTitles()
const { categories, loading, isFetchingMore, isIncomeFilter, handleScroll, setFilter, create, remove } =
  useCategories()

const filterOptions = computed(() => [
  { l: t('category.all'), v: null },
  { l: t('category.incomes'), v: true },
  { l: t('category.expenses'), v: false },
])

// Modal state (UI concern, stays in component)
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const itemToDelete = ref(null)

function openDeleteModal(category) {
  itemToDelete.value = category
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (itemToDelete.value) await remove(itemToDelete.value.id)
  showDeleteModal.value = false
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex p-1 bg-muted rounded-xl gap-1">
      <button
        v-for="opt in filterOptions"
        :key="opt.l"
        @click="setFilter(opt.v)"
        class="flex-1 py-1.5 text-xs font-medium rounded-lg transition-all"
        :class="
          isIncomeFilter === opt.v
            ? 'bg-card shadow-sm text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        "
      >
        {{ opt.l }}
      </button>
    </div>

    <div v-if="loading && categories.length === 0" class="space-y-2">
      <div v-for="i in 3" :key="i" class="h-14 w-full bg-muted animate-pulse rounded-xl"></div>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div @scroll="handleScroll" class="max-h-[350px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="flex items-center justify-between p-3 rounded-xl border border-border bg-card/40 hover:bg-card/60 transition-all group"
        >
          <div class="flex items-center gap-3">
            <div
              class="p-2 rounded-lg"
              :class="cat.is_income ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'"
            >
              <TrendingUp v-if="cat.is_income" class="w-4 h-4" />
              <TrendingDown v-else class="w-4 h-4" />
            </div>
            <span class="font-medium text-sm">{{ categoryTitle(cat) }}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            class="h-9 w-9 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 active:bg-destructive/20 transition-colors shrink-0"
            @click.stop="openDeleteModal(cat)"
          >
            <Trash2 class="w-4 h-4" />
          </Button>
        </div>

        <div v-if="isFetchingMore" class="flex justify-center py-2">
          <Loader2 class="w-5 h-5 animate-spin text-primary" />
        </div>
      </div>

      <Button
        variant="outline"
        class="w-full h-11 border-dashed border-2 gap-2 text-muted-foreground hover:text-primary rounded-xl"
        @click="showAddModal = true"
      >
        <Plus class="w-4 h-4" /> {{ $t('category.add') }}
      </Button>
    </div>

    <AddCategoryModal :show="showAddModal" @close="showAddModal = false" @created="create" />
    <ConfirmModal
      :show="showDeleteModal"
      :title="$t('category.delete_title')"
      :description="$t('category.delete_desc', { title: categoryTitle(itemToDelete) })"
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
