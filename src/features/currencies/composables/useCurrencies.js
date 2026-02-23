import { ref, onMounted } from 'vue'
import { getCurrencies, createCurrency, deleteCurrency } from '@/api/currencies'

const PER_PAGE = 10

/**
 * Manages currencies list state: fetching, scroll-based pagination, create, delete.
 */
export function useCurrencies() {
  const currencies = ref([])
  const loading = ref(false)
  const isFetchingMore = ref(false)
  const allLoaded = ref(false)
  const page = ref(1)

  async function load(append = false) {
    if (!append) loading.value = true

    const response = await getCurrencies(append ? page.value + 1 : 1, PER_PAGE)

    if (response.success) {
      if (append) {
        currencies.value = [...currencies.value, ...response.currencies]
        page.value++
      } else {
        currencies.value = response.currencies
        page.value = 1
      }
      if (response.currencies.length < PER_PAGE) allLoaded.value = true
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
    await createCurrency(data.title, data.code, data.symbol, data.decimal_digits)
    allLoaded.value = false
    await load(false)
  }

  async function remove(id) {
    await deleteCurrency(id)
    allLoaded.value = false
    await load(false)
  }

  onMounted(() => load())

  return { currencies, loading, isFetchingMore, handleScroll, create, remove }
}
