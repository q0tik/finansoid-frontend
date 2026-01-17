import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProfiles, getMainProfileId } from '@/api/profiles' // Импортируем новый метод

export const useProfileStore = defineStore('profileStore', () => {
  const profiles = ref([])
  const loading = ref(false)
  const activeProfile = ref(localStorage.getItem('active_profile') || null)

  /**
   * Загрузка профилей
   */
  async function fetchProfiles({ page = 1, perPage = 5, append = false } = {}) {
    if (!append) loading.value = true
    try {
      const res = await getProfiles(page, perPage)
      if (res.success && Array.isArray(res.profiles)) {
        if (append) {
          const newProfiles = res.profiles.filter(
            (newP) => !profiles.value.some((oldP) => oldP.id === newP.id)
          )
          profiles.value = [...profiles.value, ...newProfiles]
        } else {
          profiles.value = res.profiles
        }
        return res.profiles
      }
      return []
    } catch (error) {
      console.error('Failed to fetch profiles:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Проверка и установка профиля по умолчанию
   */
  async function ensureDefaultProfile() {
    // 1. Если в localStorage уже есть id, просто подгружаем список профилей и выходим
    if (activeProfile.value) {
      await fetchProfiles({ page: 1, perPage: 10 })
      return
    }

    // 2. Если активный профиль не установлен, запрашиваем "Main" у бэкенда
    const mainId = await getMainProfileId()
    
    if (mainId && typeof mainId === 'string') {
      setActiveProfile(mainId)
      // После установки активного профиля загружаем список
      await fetchProfiles({ page: 1, perPage: 10 })
    } else {
      // Фолбек: если вдруг метод не вернул ID, пробуем загрузить список и взять первый
      await fetchProfiles({ page: 1, perPage: 10 })
      if (profiles.value.length > 0) {
        setActiveProfile(profiles.value[0].id)
      }
    }
  }

  /**
   * Смена активного профиля
   */
  function setActiveProfile(id) {
    activeProfile.value = id
    localStorage.setItem('active_profile', id)
  }

  return {
    profiles,
    loading,
    activeProfile,
    fetchProfiles,
    ensureDefaultProfile,
    setActiveProfile,
  }
})