type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY';

const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CNY: 7.24,
  PHP: 56.50,
};

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  PHP: '₱',
};

export function convertPrice(priceUSD: number, currency: Currency): string {
  const converted = priceUSD * exchangeRates[currency];
  const symbol = currencySymbols[currency];
  
  if (currency === 'JPY' || currency === 'CNY' || currency === 'PHP') {
    return `${symbol}${Math.round(converted)}`;
  }
  
  return `${symbol}${converted.toFixed(2)}`;
}

export function getCurrencySymbol(currency: Currency): string {
  return currencySymbols[currency];
}
