import api from "./client";

// Получить список счет (GET /finansoid-api/v1/accounts?page=1&per_page=10)
export async function getAccounts(profile_id, page = 1, perPage = 10) {
  try {
    const { data } = await api.get('/finansoid-api/v1/accounts', {
      params: { profile_id, page, per_page: perPage },
    })
    return data
  } catch (err) {
    console.error('getAccounts() failed:', err)
    return { success: false, accounts: [], pagination: { page: 1, per_page: perPage, total: 0 } }
  }
}

// Получить список счетов для дропдауна (GET /finansoid-api/v1/accounts/dropdown?profile_id=1)
export async function getAccountsDropdown(profile_id) {
  try {
    const { data } = await api.get('/finansoid-api/v1/accounts/dropdown', {
      params: { profile_id },
    })
    return data
  } catch (err) {
    console.error('getAccountsDropdown() failed:', err)
    return { success: false, accounts_short: [], pagination: { page: null, per_page: null, total: 0 } }
  }
}

// Создать счет (POST /finansoid-api/v1/accounts)
export async function createAccount(profile_id, title, currency_id, saldo) {
  try {
    const { data } = await api.post('/finansoid-api/v1/accounts', { profile_id, title, currency_id, saldo })
    return data
  } catch (err) {
    console.error('createAccount() failed:', err)
    return { success: false }
  }
}

// Удалить счет (DELETE /finansoid-api/v1/accounts/{id})
export async function deleteAccount(id) {
  try {
    const { data } = await api.delete(`/finansoid-api/v1/accounts/${id}`)
    return data
  } catch (err) {
    console.error('deleteAccount() failed:', err)
    return { success: false }
  }
}
