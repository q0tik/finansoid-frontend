import { ref, onMounted } from 'vue'
import { getCategories, createCategory, deleteCategory } from '@/api/categories'

const PER_PAGE = 10

/**
 * Manages categories list state: fetching, scroll-based pagination,
 * income/expense filter, create, delete.
 */
export function useCategories() {
  const categories = ref([])
  const loading = ref(false)
  const isFetchingMore = ref(false)
  const allLoaded = ref(false)
  const page = ref(1)
  const isIncomeFilter = ref(null)

  async function load(append = false) {
    if (!append) loading.value = true

    const response = await getCategories(
      append ? page.value + 1 : 1,
      PER_PAGE,
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
      allLoaded.value = response.categories.length < PER_PAGE
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

  function setFilter(val) {
    isIncomeFilter.value = val
    allLoaded.value = false
    load(false)
  }

  async function create(data) {
    await createCategory(data.title, data.is_income)
    allLoaded.value = false
    await load(false)
  }

  async function remove(id) {
    await deleteCategory(id)
    allLoaded.value = false
    await load(false)
  }

  onMounted(() => load())

  return { categories, loading, isFetchingMore, isIncomeFilter, handleScroll, setFilter, create, remove }
}
