import api from "./client";

// Получить список категорий (GET /finansoid-api/v1/categories?page=1&per_page=10)
export async function getCategories(profile_id, page = 1, perPage = 10, is_income = null) {
  try {
    const { data } = await api.get('/finansoid-api/v1/categories', {
      params: { profile_id, page, per_page: perPage, is_income },
    })
    /*
    Example response:
    {
      success: true,
      categories: [
        { id: 1, profile_id: 1, title: "Salary", is_income: true },
        { id: 2, profile_id: 1, title: "Groceries", is_income: false },
        ...
      ],
      pagination: { page: 1, per_page: 10, total: 25 }
    }
    */
    return data
  } catch (err) {
    console.error('getCategories() failed:', err)
    return { success: false, categories: [], pagination: { page: 1, per_page: perPage, total: 0 } }
  }
}

// Создать категорию (POST /finansoid-api/v1/categories)
export async function createCategory(profile_id, title, is_income) {
  try {
    const { data } = await api.post('/finansoid-api/v1/categories', { profile_id, title, is_income })
    return data
  } catch (err) {
    console.error('createCategory() failed:', err)
    return { success: false }
  }
}

// Удалить категорию (DELETE /finansoid-api/v1/categories/{id})
export async function deleteCategory(id) {
  try {
    const { data } = await api.delete(`/finansoid-api/v1/categories/${id}`)
    return data
  } catch (err) {
    console.error('deleteCategory() failed:', err)
    return { success: false }
  }
}
