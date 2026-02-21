import api from "./client";


// Создать фидбэк (POST /finansoid-api/v1/feedback)
export async function createFeedback(message, type) {
  try {
    const { data } = await api.post('/finansoid-api/v1/feedback', { message, type })
    return data
  } catch (err) {
    console.error('createAccount() failed:', err)
    return { success: false }
  }
}
