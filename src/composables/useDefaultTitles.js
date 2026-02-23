import { useI18n } from 'vue-i18n'

// Maps default category UUIDs to i18n keys
const CATEGORY_ID_TO_KEY = {
  '00000000-0000-0000-0000-000000000000': 'categories_default.transfer',
  '00000000-0000-0000-0000-000000000001': 'categories_default.food_groceries',
  '00000000-0000-0000-0000-000000000002': 'categories_default.transport',
  '00000000-0000-0000-0000-000000000003': 'categories_default.rent_utilities',
  '00000000-0000-0000-0000-000000000004': 'categories_default.entertainment',
  '00000000-0000-0000-0000-000000000005': 'categories_default.health_pharmacy',
  '00000000-0000-0000-0000-000000000006': 'categories_default.education',
  '00000000-0000-0000-0000-000000000007': 'categories_default.shopping',
  '00000000-0000-0000-0000-000000000008': 'categories_default.subscriptions',
  '00000000-0000-0000-0000-000000000009': 'categories_default.taxes_fees',
  '00000000-0000-0000-0000-000000000010': 'categories_default.household',
  '00000000-0000-0000-0000-000000000011': 'categories_default.salary',
  '00000000-0000-0000-0000-000000000012': 'categories_default.freelance',
  '00000000-0000-0000-0000-000000000013': 'categories_default.investments',
  '00000000-0000-0000-0000-000000000014': 'categories_default.gifts',
  '00000000-0000-0000-0000-000000000015': 'categories_default.cashback',
  '00000000-0000-0000-0000-000000000016': 'categories_default.sale_of_assets',
}

// Maps currency codes to i18n keys (stable across locales)
const CURRENCY_CODE_TO_KEY = {
  'USD': 'currencies_default.usd',
  'EUR': 'currencies_default.eur',
  'GBP': 'currencies_default.gbp',
  'RUB': 'currencies_default.rub',
  'CNY': 'currencies_default.cny',
  'GEL': 'currencies_default.gel',
  'THB': 'currencies_default.thb',
  'KGS': 'currencies_default.kgs',
  'KZT': 'currencies_default.kzt',
  'RSD': 'currencies_default.rsd',
  'AED': 'currencies_default.aed',
  'TRY': 'currencies_default.try_lira',
  'USDT': 'currencies_default.usdt',
  'BTC': 'currencies_default.btc',
  'ETH': 'currencies_default.eth',
}

export function useDefaultTitles() {
  const { t } = useI18n()

  function categoryTitle(category) {
    if (!category) return ''
    const key = CATEGORY_ID_TO_KEY[category.id]
    return key ? t(key) : category.title
  }

  function currencyTitle(currency) {
    if (!currency) return ''
    const key = CURRENCY_CODE_TO_KEY[currency.code]
    return key ? t(key) : currency.title
  }

  return { categoryTitle, currencyTitle }
}
