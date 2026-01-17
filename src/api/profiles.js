import api from "./client";

// Получить список профилей (GET /finansoid-api/v1/profiles?page=1&per_page=10)
export async function getProfiles(page = 1, perPage = 10) {
  try {
    const { data } = await api.get('/finansoid-api/v1/profiles', {
      params: { page, per_page: perPage },
    })
    return data
  } catch (err) {
    console.error('getProfiles() failed:', err)
    return { success: false, profiles: [], pagination: { page: 1, per_page: perPage, total: 0 } }
  }
}

// Создать профиль (POST /finansoid-api/v1/profiles)
export async function createProfile(title) {
  try {
    const { data } = await api.post('/finansoid-api/v1/profiles', { title })
    return data
  } catch (err) {
    console.error('createProfile() failed:', err)
    return { success: false }
  }
}

export async function getMainProfileId() {
  try {
    const { data } = await api.get('/finansoid-api/v1/profiles/main')
    return data.profile_id
  } catch (err) {
    console.error('getMainProfileId() failed:', err)
    return { success: false }
  }
}
// Удалить профиль (DELETE /finansoid-api/v1/profiles/{id})
export async function deleteProfile(id) {
  try {
    const { data } = await api.delete(`/finansoid-api/v1/profiles/${id}`)
    return data
  } catch (err) {
    console.error('deleteProfile() failed:', err)
    return { success: false }
  }
}
