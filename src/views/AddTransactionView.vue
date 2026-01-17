<script setup>
import { ref } from 'vue'
import ExpenseTransactionForm from '@/components/transactions/ExpenseTransactionForm.vue'
import IncomeTransactionForm from '@/components/transactions/IncomeTransactionForm.vue'
import TransferTransactionForm from '@/components/transactions/TransferTransactionForm.vue'

const activeTab = ref('expense')

const tabs = [
  { key: 'expense', label: 'Expense' },
  { key: 'income', label: 'Income' },
  { key: 'transfer', label: 'Transfer' },
]
</script>

<template>
  <div class="h-full flex flex-col bg-background">
    <div class="p-4 shrink-0">
      <div class="flex p-1 bg-muted rounded-2xl gap-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200"
          :class="activeTab === tab.key 
            ? 'bg-card shadow-sm text-primary scale-[1.02]' 
            : 'text-muted-foreground hover:text-foreground'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-4 pb-10">
      <transition name="fade-slide" mode="out-in">
        <div :key="activeTab">
          <ExpenseTransactionForm v-if="activeTab === 'expense'" />
          <IncomeTransactionForm v-else-if="activeTab === 'income'" />
          <TransferTransactionForm v-else />
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>