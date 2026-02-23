import { ref, onMounted } from 'vue'
import { getAccounts, createAccount, deleteAccount } from '@/api/accounts'

const PER_PAGE = 6

/**
 * Manages accounts list state: fetching, scroll-based pagination, create, delete.
 * Pass the scroll event from your scrollable container to `handleScroll`.
 */
export function useAccounts() {
  const accounts = ref([])
  const loading = ref(false)
  const isFetchingMore = ref(false)
  const allLoaded = ref(false)
  const page = ref(1)

  async function load(append = false) {
    if (!append) loading.value = true

    const response = await getAccounts(append ? page.value + 1 : 1, PER_PAGE)

    if (response.success) {
      if (append) {
        accounts.value = [...accounts.value, ...response.accounts]
        page.value++
      } else {
        accounts.value = response.accounts
        page.value = 1
      }
      if (response.accounts.length < PER_PAGE) allLoaded.value = true
    }
    loading.value = false
    isFetchingMore.value = false
  }

  async function handleScroll(event) {
    const { scrollTop, scrollHeight, clientHeight } = event.target
    if (
      scrollTop + clientHeight >= scrollHeight - 20 &&
      !isFetchingMore.value &&
      !allLoaded.value
    ) {
      isFetchingMore.value = true
      await load(true)
    }
  }

  async function create(data) {
    await createAccount(data.title, data.currency_id, data.saldo)
    allLoaded.value = false
    await load(false)
  }

  async function remove(id) {
    await deleteAccount(id)
    allLoaded.value = false
    await load(false)
  }

  onMounted(() => load())

  return { accounts, loading, isFetchingMore, handleScroll, create, remove }
}
