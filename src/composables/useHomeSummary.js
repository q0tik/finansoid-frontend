import { ref, watch } from 'vue'
import { useProfileStore } from '@/stores/profileStore'
import { getHomeSummary } from '@/api/home'

export function useHomeSummary() {
  const store = useProfileStore()
  const period = ref('last_month')
  const summary = ref(null)
  const loading = ref(false)

  async function fetchSummary() {
    if (!store.activeProfile) return
    loading.value = true
    const data = await getHomeSummary(period.value)
    summary.value = data.success !== false ? data : null
    loading.value = false
  }

  watch([period, () => store.activeProfile], fetchSummary, { immediate: true })

  return { period, summary, loading, fetchSummary }
}
