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

// Получить счет по id (GET /finansoid-api/v1/accounts/{id})
export async function getAccountById(id, profile_id) {
  try {
    const { data } = await api.get(`/finansoid-api/v1/accounts/${id}`, { params: { profile_id } })
    /*
    Example response
    {
      'success': True,
      'account': {
        'balance': '0',
        'currency': {
          'id': '844b4640-0713-4a2a-ada9-f9e1270ccb8b',
          'symbol': 'a9',
          'title': 'c0cc3ce896da4842'
          },
        'id': 'cba95256-8e65-4bd7-bdc6-f384bb121662',
        'is_owner': False,
        'profiles': [
            {
              'id': 'd9386150-39d6-41d7-be65-61802a9c437c',
              'is_owner': False,
              'title': 'c470c5fe11716c5c'
            },
            {
              'id': '5e0d267c-0bc9-4c9c-858f-446c7808df25',
              'is_owner': False,
              'title': 'c1a663e5aa183cb3'
            }
          ],
        'title': '227fa48faf380246',
        'transactions_count': 5
      },
    }
    */
    return data
  } catch (err) {
    console.error('getAccountById() failed:', err)
    return { success: false }
  }
}

// Получить счет по id (PUT /finansoid-api/v1/accounts/{id})
export async function editAccountById(id, profile_id, title) {
  try {
    const { data } = await api.put(`/finansoid-api/v1/accounts/${id}`, { profile_id, title })
    /*
    Example response
    {
      'success': True
    }
    */
    return data
  } catch (err) {
    console.error('editAccountById() failed:', err)
    return { success: false }
  }
}

// Добавить профиль к счету (POST /finansoid-api/v1/accounts/{id}/profile)
export async function addProfileToAccount(id, profile_id, new_profile_id) {
  try {
    const { data } = await api.post(`/finansoid-api/v1/accounts/${id}/profile`, { profile_id, new_profile_id })
    /*
    Example response
    {
      'success': True
    }
    */
    return data
  } catch (err) {
    console.error('addProfileToAccount() failed:', err)
    return { success: false }
  }
}
