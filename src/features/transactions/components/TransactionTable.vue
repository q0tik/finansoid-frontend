<script setup>
import { ref, onMounted } from 'vue'
import { ArrowUp } from 'lucide-vue-next'
import { getAccountsDropdown } from '@/api/accounts'
import { useTransactions } from '@/features/transactions/composables/useTransactions'
import TransactionFilters from '@/features/transactions/components/TransactionFilters.vue'
import TransactionList from '@/features/transactions/components/TransactionList.vue'

const { accountId, fromDttm, toDttm, loading, hasMore, isInitialLoad, transactionsByDate, loadMore } =
  useTransactions()

const accounts = ref([])
const scrollComponent = ref(null)
const showScrollTop = ref(false)

const handleScroll = (e) => {
  showScrollTop.value = e.target.scrollTop > 300
}
const scrollToTop = () => {
  scrollComponent.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  try {
    const res = await getAccountsDropdown()
    accounts.value = res.accounts_short
  } catch (e) {
    console.error(e)
  }
  loadMore()
})
</script>

<template>
  <div class="flex flex-col h-full bg-background relative overflow-hidden">
    <div
      class="shrink-0 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-4 z-50"
    >
      <TransactionFilters
        v-model:accountId="accountId"
        v-model:fromDttm="fromDttm"
        v-model:toDttm="toDttm"
        :accounts="accounts"
      />
    </div>

    <Transition name="fade-pop">
      <button
        v-if="showScrollTop"
        @click="scrollToTop"
        class="absolute bottom-28 right-6 z-[70] w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform border-4 border-background"
      >
        <ArrowUp class="w-6 h-6" />
      </button>
    </Transition>

    <div
      ref="scrollComponent"
      @scroll="handleScroll"
      class="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 pb-24"
    >
      <TransactionList
        :groups="transactionsByDate"
        :loading="loading"
        :has-more="hasMore"
        :is-initial-load="isInitialLoad"
        :load-more="loadMore"
      />
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 0px;
}
.fade-pop-enter-active,
.fade-pop-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-pop-enter-from,
.fade-pop-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(20px);
}
</style>
