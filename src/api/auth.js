import api from "./client";

// Логин (POST /finansoid-api/v1/auth/login)
export async function login(username, password) {
  try {
    const { data } = await api.post('/finansoid-api/v1/auth/login', {
      username,
      password,
    })
    return { success: true, data }
  } catch (err) {
    console.error('login() failed:', err)
    return { success: false, error: err.response?.data?.detail || 'Login failed' }
  }
}

// Регистрация (POST /finansoid-api/v1/auth/register)
export async function register(username, password) {
  try {
    const { data } = await api.post('/finansoid-api/v1/auth/register', {
      username,
      password,
    })
    return { success: true, data }
  } catch (err) {
    console.error('register() failed:', err)
    return { success: false, error: err.response?.data?.detail || 'Register failed' }
  }
}

// ------TG------
// Послать callback телеговской авторизации (POST /finansoid-api/v1/auth/telegram/callback)
export async function telegramCallback(tg_data) {
  try {
    const { data } = await api.post('/finansoid-api/v1/auth/telegram/callback', {tg_data}, { timeout: 20000 })
    return { success: true, data }
  } catch (err) {
    console.error('telegramCallback() failed:', err)
    return { success: false, error: err.response?.data?.detail || 'telegramCallback failed' }
  }
}

// --Авторизация через mini-app--
// Разбор initData = "query_id=...&user=...&auth_date=...&hash=..."
export function parseInitData(initData) {
  const params = new URLSearchParams(initData)
  const obj = {}

  for (const [key, value] of params.entries()) {
    // if (key === 'user') {
    //   obj.user = JSON.parse(value)
    //   continue
    // }
    obj[key] = value
  }

  return obj
}

// POST /auth/telegram/miniapp
export async function loginMiniApp(initData) {
  try {
    const parsed = parseInitData(initData)
    console.log("[AUTH-API] raw", initData)
    console.log("[AUTH-API] parsed", parsed)

    const { data } = await api.post(
      '/finansoid-api/v1/auth/telegram/miniapp',
      parsed,
      { timeout: 20000 }
    )

    return { success: true, data }
  } catch (err) {
    console.error('loginMiniApp() failed:', err)
    return {
      success: false,
      error: err.response?.data?.detail || 'MiniApp auth failed',
    }
  }
}
// ----
// ------------

