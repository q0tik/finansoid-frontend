<script setup>
import { ref, onMounted } from 'vue'
import { Trash2, Plus, Loader2, Tag, TrendingUp, TrendingDown } from 'lucide-vue-next'
import { getCategories, createCategory, deleteCategory } from '@/api/categories'
import { Button } from '@/components/ui/button'

import AddCategoryModal from '@/components/AddCategoryModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const categories = ref([])
const loading = ref(false)
const isFetchingMore = ref(false)
const allLoaded = ref(false)
const page = ref(1)
const perPage = 10
const isIncomeFilter = ref(null)

// Модалки
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const itemToDelete = ref(null)

async function loadCategories(append = false) {
  const profileId = localStorage.getItem('active_profile')
  if (!append) loading.value = true
  
  const response = await getCategories(
    profileId, 
    append ? page.value + 1 : 1, 
    perPage, 
    isIncomeFilter.value
  )
  
  if (response.success) {
    if (append) {
      categories.value = [...categories.value, ...response.categories]
      page.value++
    } else {
      categories.value = response.categories
      page.value = 1
    }
    allLoaded.value = response.categories.length < perPage
  }
  loading.value = false
  isFetchingMore.value = false
}

async function handleScroll(event) {
  const { scrollTop, scrollHeight, clientHeight } = event.target
  if (scrollTop + clientHeight >= scrollHeight - 20 && !isFetchingMore.value && !allLoaded.value) {
    isFetchingMore.value = true
    await loadCategories(true)
  }
}

function toggleFilter(val) {
  isIncomeFilter.value = val
  allLoaded.value = false
  loadCategories(false)
}

async function handleAdd(catData) {
  await createCategory(catData.profile_id, catData.title, catData.is_income)
  allLoaded.value = false
  await loadCategories(false)
}

function openDeleteModal(category) {
  itemToDelete.value = category
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (itemToDelete.value) {
    await deleteCategory(itemToDelete.value.id)
    allLoaded.value = false
    await loadCategories(false)
  }
  showDeleteModal.value = false
}

onMounted(() => loadCategories())
</script>

<template>
  <div class="space-y-4">
    <div class="flex p-1 bg-muted rounded-xl gap-1">
      <button 
        v-for="opt in [{l:'All', v:null}, {l:'Incomes', v:true}, {l:'Expenses', v:false}]"
        :key="opt.l"
        @click="toggleFilter(opt.v)"
        class="flex-1 py-1.5 text-xs font-medium rounded-lg transition-all"
        :class="isIncomeFilter === opt.v ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'"
      >
        {{ opt.l }}
      </button>
    </div>

    <div v-if="loading && categories.length === 0" class="space-y-2">
      <div v-for="i in 3" :key="i" class="h-14 w-full bg-muted animate-pulse rounded-xl"></div>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div 
        @scroll="handleScroll"
        class="max-h-[350px] overflow-y-auto pr-1 space-y-2 custom-scrollbar"
      >
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
            <span class="font-medium text-sm">{{ cat.title }}</span>
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
        <Plus class="w-4 h-4" /> Add Category
      </Button>
    </div>

    <AddCategoryModal :show="showAddModal" @close="showAddModal = false" @created="handleAdd" />

    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Category?"
      :description="`Are you sure you want to delete '${itemToDelete?.title}'? This action cannot be undone.`"
      confirm-text="Delete"
      danger
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>