import api from "./client";

// Получить список валют (GET /finansoid-api/v1/currencies?page=1&per_page=10)
export async function getCurrencies(profile_id, page = 1, perPage = 10) {
  try {
    const { data } = await api.get('/finansoid-api/v1/currencies', {
      params: { profile_id, page, per_page: perPage },
    })
    /*
    Example response:
    {
      success: true,
      currencies: [
        { id: 1, title: "US Dollar", code: "USD", symbol: "$", decimal_digits: 2 },
        { id: 2, title: "Euro", code: "EUR", symbol: "€", decimal_digits: 4 },
        ...
      ],
      pagination: { page: 1, per_page: 10, total: 25 }
    }
    */
    return data
  } catch (err) {
    console.error('getCurrencies() failed:', err)
    return { success: false, currencies_short: [], pagination: { page: 1, per_page: perPage, total: 0 } }
  }
}

// Получить список валют для дропдауна (GET /finansoid-api/v1/currencies/dropdown?profile_id=1)
export async function getCurrenciesDropdown(profile_id) {
  try {
    const { data } = await api.get('/finansoid-api/v1/currencies/dropdown', {
      params: { profile_id },
    })
    return data
  } catch (err) {
    console.error('getCurrencies() failed:', err)
    return { success: false, currencies_short: [], pagination: { page: null, per_page: null, total: 0 } }
  }
}


// Создать валюту (POST /finansoid-api/v1/currencies)
export async function createCurrency(profile_id, title, code, symbol, decimal_digits) {
  try {
    const { data } = await api.post('/finansoid-api/v1/currencies', { profile_id, title, code, symbol, decimal_digits })
    return data
  } catch (err) {
    console.error('createCurrency() failed:', err)
    return { success: false }
  }
}

// Удалить валюту (DELETE /finansoid-api/v1/currencies/{id})
export async function deleteCurrency(id) {
  try {
    const { data } = await api.delete(`/finansoid-api/v1/currencies/${id}`)
    return data
  } catch (err) {
    console.error('deleteCurrency() failed:', err)
    return { success: false }
  }
}
