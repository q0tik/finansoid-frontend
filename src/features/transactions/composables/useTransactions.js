import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTransactions } from '@/api/transactions'

const PER_PAGE = 30
const LOAD_DELAY_MS = 800

/**
 * Manages transaction list state: fetching, pagination, filtering, and URL sync.
 *
 * Filters (accountId, fromDttm, toDttm) are kept in sync with URL query params.
 * A watcher automatically reloads when any filter changes.
 *
 * Call `loadMore()` manually on mount for the initial load.
 */
export function useTransactions() {
  const route = useRoute()
  const router = useRouter()

  const accountId = ref(route.query.account_id || null)
  const fromDttm = ref(route.query.from_dttm || '')
  const toDttm = ref(route.query.to_dttm || '')

  const transactions = ref([])
  const loading = ref(false)
  const page = ref(1)
  const total = ref(0)
  const hasMore = ref(true)
  const isInitialLoad = ref(true)

  const transactionsByDate = computed(() => {
    const groups = {}
    transactions.value.forEach((tx) => {
      const dateKey = new Date(tx.created_at).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(tx)
    })
    return groups
  })

  function reset() {
    transactions.value = []
    page.value = 1
    hasMore.value = true
    isInitialLoad.value = true
  }

  async function loadMore() {
    if (loading.value || !hasMore.value) return
    loading.value = true
    if (!isInitialLoad.value) await new Promise((r) => setTimeout(r, LOAD_DELAY_MS))

    try {
      const res = await getTransactions(
        page.value,
        PER_PAGE,
        accountId.value,
        fromDttm.value,
        toDttm.value
      )
      if (res.success) {
        transactions.value.push(...res.transactions)
        total.value = res.pagination.total
        if (transactions.value.length >= total.value || res.transactions.length < PER_PAGE) {
          hasMore.value = false
        } else {
          page.value++
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
      isInitialLoad.value = false
    }
  }

  function applyFilters() {
    router.replace({
      query: {
        ...route.query,
        account_id: accountId.value || undefined,
        from_dttm: fromDttm.value || undefined,
        to_dttm: toDttm.value || undefined,
      },
    })
    reset()
    loadMore()
  }

  watch([accountId, fromDttm, toDttm], applyFilters)

  return {
    accountId,
    fromDttm,
    toDttm,
    transactions,
    loading,
    hasMore,
    isInitialLoad,
    transactionsByDate,
    loadMore,
  }
}
