import api from "./client";

// Получить список транзакций (GET /finansoid-api/v1/transactions?page=1&per_page=10)
export async function getTransactions(profile_id, page = 1, perPage = 10, is_income = null, account_id = null) {
  try {
    const { data } = await api.get('/finansoid-api/v1/transactions', {
      params: { profile_id, page, per_page: perPage, is_income },
    })
    /*
    Example response:
    {
      success: true,
      transactions: [
        { 
            id: '311bf963-5567-4207-a8fa-6626271c3110',
            amount: '399.0',
            currency_from_symbol: null,
            currency_to_symbol: '₽',
            exchange_rate: null,
            category: {
                title: 'salary',
                is_income: true,
            },
            created_at: '2025-11-17 14:47:31.197034+00:00',
        },
        { 
            id: '2f9e1416-4146-451f-8bae-aa3a5f45650b',
            amount: '29.34',
            currency_from_symbol: '₽',
            currency_to_symbol: '$',
            exchange_rate: '88.13',
            category: {
                title: 'transfer',
                is_income: null,
            },
            currency_symbol: null,
            created_at: '2025-08-03 12:33:01.092122+00:00',
        },
        { 
            id: '362b5d40-89e1-4266-95db-647f3dab46f6', 
            amount: '134.0003',
            currency_from_symbol: null,
            currency_to_symbol: '$',
            exchange_rate: null,
            category: {
                title: 'health',
                is_income: false,
            },
            created_at: '2021-08-03 12:33:01.092122+00:00',
        },
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

// Создать транзакцию (POST /finansoid-api/v1/transactions)
export async function createTransaction(amount, category_id, from_account_id, to_account_id, exchange_rate, comment = null) {
  try {
    const { data } = await api.post('/finansoid-api/v1/transactions', { amount, category_id, from_account_id, to_account_id, exchange_rate, comment })
    return data
  } catch (err) {
    console.error('createCategory() failed:', err)
    return { success: false }
  }
}
