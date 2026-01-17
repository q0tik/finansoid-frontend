import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
let refreshInProgress = false

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
// Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwicHJvZmlsZV9pZHMiOlsiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIl0sImV4cGlyZXNfYXQiOjE4NjYwNzcxODR9.UFjSwZNY3-BudF7aG88TrL7wz8yo_c3v8XIWs7uSCqM

// Refresh token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwiZXhwaXJlc19hdCI6MTk2NjA3NzE4M30.VKKSVQHojp_-m7ZUqCwmSVBqy01U1flxJt6zegekO38

// Обновить токен (POST /finansoid-api/v1/auth/refresh)
export async function refreshToken() {
  try {
    const { data } = await api.post('/finansoid-api/v1/auth/refresh')
    return { success: true, data }
  } catch (err) {
    if (err.response?.status === 401)
      return { success: false, unauthorized: true }

    console.error('refreshToken() failed:', err)
    return { success: false }
  }
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {

      if (!refreshInProgress) {
        refreshInProgress = true
        
        const ok = await refreshToken()
        refreshInProgress = false

        if (ok) {
          return api(err.config) // повторяем запрос
        }

        router.push('/login')
      }

      return
    }
    console.error('API error:', err)
    throw err
  }
)

export default api