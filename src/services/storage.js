/**
 * Local Storage Service using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  EXPENSES: '@spendwise:expenses',
  BUDGET: '@spendwise:budget',
  BILLS: '@spendwise:bills',
  USER: '@spendwise:user',
  SETTINGS: '@spendwise:settings',
  NOTIFICATIONS: '@spendwise:notifications',
  BANK_TRANSACTIONS: '@spendwise:bank_transactions',
};

/**
 * Generic storage methods
 */
export const Storage = {
  // Get item
  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },

  // Set item
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  },

  // Remove item
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage removeItem error:', error);
      return false;
    }
  },

  // Clear all
  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },
};

/**
 * Expense-specific storage methods
 */
export const ExpenseStorage = {
  async getAll() {
    return (await Storage.getItem(STORAGE_KEYS.EXPENSES)) || [];
  },

  async save(expense) {
    const expenses = await this.getAll();
    expenses.push({
      ...expense,
      id: expense.id || Date.now().toString(),
      createdAt: expense.createdAt || new Date().toISOString(),
    });
    return await Storage.setItem(STORAGE_KEYS.EXPENSES, expenses);
  },

  async update(id, updates) {
    const expenses = await this.getAll();
    const index = expenses.findIndex((e) => e.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updates };
      return await Storage.setItem(STORAGE_KEYS.EXPENSES, expenses);
    }
    return false;
  },

  async delete(id) {
    const expenses = await this.getAll();
    const filtered = expenses.filter((e) => e.id !== id);
    return await Storage.setItem(STORAGE_KEYS.EXPENSES, filtered);
  },
};

/**
 * Budget storage methods
 */
export const BudgetStorage = {
  async get() {
    return (await Storage.getItem(STORAGE_KEYS.BUDGET)) || { monthly: 0, currentMonth: new Date().getMonth() };
  },

  async set(amount) {
    return await Storage.setItem(STORAGE_KEYS.BUDGET, {
      monthly: amount,
      currentMonth: new Date().getMonth(),
      updatedAt: new Date().toISOString(),
    });
  },
};

/**
 * Bills storage methods
 */
export const BillsStorage = {
  async getAll() {
    return (await Storage.getItem(STORAGE_KEYS.BILLS)) || [];
  },

  async save(bill) {
    const bills = await this.getAll();
    bills.push({
      ...bill,
      id: bill.id || Date.now().toString(),
      createdAt: bill.createdAt || new Date().toISOString(),
    });
    return await Storage.setItem(STORAGE_KEYS.BILLS, bills);
  },

  async update(id, updates) {
    const bills = await this.getAll();
    const index = bills.findIndex((b) => b.id === id);
    if (index !== -1) {
      bills[index] = { ...bills[index], ...updates };
      return await Storage.setItem(STORAGE_KEYS.BILLS, bills);
    }
    return false;
  },

  async delete(id) {
    const bills = await this.getAll();
    const filtered = bills.filter((b) => b.id !== id);
    return await Storage.setItem(STORAGE_KEYS.BILLS, filtered);
  },
};

/**
 * User storage methods
 */
export const UserStorage = {
  async get() {
    return await Storage.getItem(STORAGE_KEYS.USER);
  },

  async save(user) {
    return await Storage.setItem(STORAGE_KEYS.USER, user);
  },

  async clear() {
    return await Storage.removeItem(STORAGE_KEYS.USER);
  },
};

export default Storage;

