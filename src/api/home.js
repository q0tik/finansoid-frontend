import api from "./client"

export async function getHomeSummary(period = 'last_month') {
  try {
    const { data } = await api.get('/finansoid-api/v1/home', { params: { period } })
    return data
  } catch (err) {
    return { success: false }
  }
}
