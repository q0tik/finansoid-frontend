<script setup>
import TransactionTable from '@/components/transactions/TransactionTable.vue'
</script>

<template>
  <div class="h-screen bg-background overflow-hidden flex flex-col">
    <TransactionTable />
  </div>
</template>

<style scoped>
/* Убираем любые системные скроллы, чтобы работал только скролл внутри таблицы */
:global(body) {
  overflow: hidden;
  height: 100vh;
}
</style>