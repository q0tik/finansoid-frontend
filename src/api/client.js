import axios from 'axios'
import router from '@/router'

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
    // ВАЖНО: Добавляем флаг _retry, чтобы интерцептор проигнорировал этот запрос
    const { data } = await api.post('/finansoid-api/v1/auth/refresh', {}, { _retry: true })
    return { success: true, data }
  } catch (err) {
    // Если даже рефреш выдал 401 — всё, полномочия всё, нужно логинить заново
    return { success: false, unauthorized: true }
  }
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // 1. Если это 401 И это НЕ повторный запрос на рефреш
    if (err.response?.status === 401 && !originalRequest._retry) {
      
      if (!refreshInProgress) {
        refreshInProgress = true
        originalRequest._retry = true // Помечаем текущий запрос как "в процессе повтора"

        const res = await refreshToken()
        refreshInProgress = false

        if (res.success) {
          // Если рефреш удался, повторяем оригинальный запрос
          return api(originalRequest)
        } else {
          router.push('/login')
          return Promise.reject(err)
        }
      }
      
      // Пока идет один рефреш, остальные 401 должны просто ждать или падать
      // Можно добавить очередь (queue), но для начала хватит и этого
      return Promise.reject(err)
    }

    console.error('API error:', err)
    throw err
  }
)

export default api