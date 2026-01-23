<script setup>
import { ref, watch, nextTick } from 'vue'
import { X, Tag, TrendingUp, TrendingDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps({ show: Boolean })
const emits = defineEmits(['close', 'created'])

const title = ref('')
const isIncome = ref(false) // По умолчанию расход

function resetForm() {
  title.value = ''
  isIncome.value = false
}

function handleSubmit() {
  if (!title.value.trim()) return
  
  emits('created', {
    profile_id: localStorage.getItem('active_profile'),
    title: title.value.trim(),
    is_income: isIncome.value,
  })

  resetForm()
  emits('close')
}

watch(() => props.show, (val) => {
  if (val) nextTick(() => document.getElementById('category-title')?.focus())
})
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 flex justify-center items-center z-[100] bg-background/80 backdrop-blur-sm p-4"
      @click.self="emits('close')"
    >
      <div class="bg-card text-card-foreground rounded-2xl shadow-xl w-full max-w-sm p-6 border border-border animate-in zoom-in-95 duration-200">
        
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-2">
            <Tag class="w-5 h-5 text-primary" />
            <h2 class="text-xl font-bold tracking-tight">Add category</h2>
          </div>
          <button @click="emits('close')" class="p-1 hover:bg-muted rounded-full transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div class="space-y-2">
            <label for="category-title" class="text-sm font-medium ml-1">Title</label>
            <input
              id="category-title"
              v-model="title"
              type="text"
              class="w-full px-4 py-3 bg-background border border-input rounded-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground"
              placeholder="e.g. Food, Salary, Rent..."
              required
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium ml-1">Type</label>
            <div class="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
              <button
                type="button"
                @click="isIncome = false"
                class="flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-sm font-medium"
                :class="!isIncome ? 'bg-card shadow text-red-500' : 'text-muted-foreground'"
              >
                <TrendingDown class="w-4 h-4" /> Expense
              </button>
              <button
                type="button"
                @click="isIncome = true"
                class="flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-sm font-medium"
                :class="isIncome ? 'bg-card shadow text-emerald-500' : 'text-muted-foreground'"
              >
                <TrendingUp class="w-4 h-4" /> Income
              </button>
            </div>
          </div>

          <Button
            type="submit"
            class="w-full h-12 text-base rounded-xl font-bold mt-2 shadow-md transition-transform active:scale-[0.98]"
          >
            Create Category
          </Button>
        </form>
      </div>
    </div>
  </transition>
</template>