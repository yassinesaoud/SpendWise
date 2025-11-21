/**
 * Currency Hook - Manage currency selection and conversion
 */

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENCY_STORAGE_KEY = '@spendwise:currency';

export type Currency = 'TND' | 'EUR' | 'USD';

interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to TND
}

const CURRENCIES: Record<Currency, CurrencyInfo> = {
  TND: { code: 'TND', symbol: 'TND', name: 'Dinar tunisien', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.3 }, // 1 TND = 0.3 EUR (example)
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.33 }, // 1 TND = 0.33 USD (example)
};

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>('TND');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrency();
  }, []);

  const loadCurrency = async () => {
    try {
      const savedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
      if (savedCurrency && (savedCurrency === 'TND' || savedCurrency === 'EUR' || savedCurrency === 'USD')) {
        setCurrency(savedCurrency as Currency);
      }
    } catch (error) {
      console.error('Error loading currency:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeCurrency = async (newCurrency: Currency) => {
    try {
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
      setCurrency(newCurrency);
    } catch (error) {
      console.error('Error saving currency:', error);
    }
  };

  const formatAmount = (amount: number, showSymbol: boolean = true): string => {
    const currencyInfo = CURRENCIES[currency];
    const convertedAmount = amount * currencyInfo.rate;
    
    if (showSymbol) {
      return `${convertedAmount.toFixed(2)} ${currencyInfo.symbol}`;
    }
    return convertedAmount.toFixed(2);
  };

  const convertToTND = (amount: number): number => {
    if (currency === 'TND') return amount;
    return amount / CURRENCIES[currency].rate;
  };

  const convertFromTND = (amount: number): number => {
    if (currency === 'TND') return amount;
    return amount * CURRENCIES[currency].rate;
  };

  return {
    currency,
    currencyInfo: CURRENCIES[currency],
    currencies: Object.values(CURRENCIES),
    changeCurrency,
    formatAmount,
    convertToTND,
    convertFromTND,
    loading,
  };
}

