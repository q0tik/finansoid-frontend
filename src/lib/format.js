/**
 * Returns the type of a transaction: 'income' | 'expense' | 'transfer'
 */
export function getTransactionType(tx) {
  if (tx.category?.title.toLowerCase() === 'transfer') return 'transfer'
  if (tx.category?.is_income) return 'income'
  return 'expense'
}

/**
 * Formats a transaction amount as a human-readable string.
 * Examples: "+1500.00 $", "-200.50 €", "100 $ → 90 €"
 */
export function formatAmount(tx) {
  const type = getTransactionType(tx)
  const truncate = (val) => Math.trunc(Math.abs(val) * 100) / 100

  if (type === 'transfer') {
    return `${truncate(tx.from_amount)} ${tx.currency_from_symbol} → ${truncate(tx.to_amount)} ${tx.currency_to_symbol}`
  }

  const isIncome = type === 'income'
  const symbol = isIncome ? tx.currency_to_symbol : tx.currency_from_symbol
  const amount = isIncome ? tx.to_amount : tx.from_amount
  const prefix = isIncome ? '+' : '-'

  return `${prefix}${truncate(amount)} ${symbol || ''}`.trim()
}

/**
 * Formats a UTC datetime string to a localized time (HH:MM).
 */
export function formatTime(utcString) {
  return new Date(utcString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Formats a UTC datetime string to a localized date label.
 * Example: "January 5, 2025"
 */
export function formatDate(utcString) {
  return new Date(utcString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
