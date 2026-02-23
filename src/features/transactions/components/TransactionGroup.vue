<script setup>
import { Calendar } from 'lucide-vue-next'
import TransactionItem from './TransactionItem.vue'

defineProps({
  date: { type: String, required: true },
  items: { type: Array, required: true },
})
</script>

<template>
  <div class="mb-6">
    <div class="sticky -top-5 bg-background/95 backdrop-blur-sm z-10 py-2 mb-1">
    <!-- # TODO: top = -5px, чтобы не было такого большого отступа между группами -->
      <h3
        class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center gap-2"
      >
        <Calendar class="w-3 h-3" />
        {{ date }}
      </h3>
    </div>
    <div
      class="bg-card border border-border/40 rounded-[24px] divide-y divide-border/20 overflow-hidden shadow-sm"
    >
      <TransactionItem v-for="tx in items" :key="tx.id" :transaction="tx" />
    </div>
  </div>
</template>

<style scoped>
.mb-6 {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
