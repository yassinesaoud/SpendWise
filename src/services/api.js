/**
 * API Service - Dummy implementation with mock data
 * In production, this would connect to a real backend API
 */

import { BillsStorage, BudgetStorage, ExpenseStorage } from './storage';

// Simulate API delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Expenses API
 */
export const ExpensesAPI = {
  // Get all expenses
  async getAll() {
    await delay(300);
    return await ExpenseStorage.getAll();
  },

  // Get expense by ID
  async getById(id) {
    await delay(200);
    const expenses = await ExpenseStorage.getAll();
    return expenses.find((e) => e.id === id) || null;
  },

  // Create expense
  async create(expense) {
    await delay(400);
    return await ExpenseStorage.save(expense);
  },

  // Update expense
  async update(id, updates) {
    await delay(400);
    return await ExpenseStorage.update(id, updates);
  },

  // Delete expense
  async delete(id) {
    await delay(300);
    return await ExpenseStorage.delete(id);
  },

  // Get expenses by month
  async getByMonth(year, month) {
    await delay(300);
    const expenses = await ExpenseStorage.getAll();
    return expenses.filter((expense) => {
      const date = new Date(expense.date || expense.createdAt);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  },
};

/**
 * Budget API
 */
export const BudgetAPI = {
  async get() {
    await delay(200);
    return await BudgetStorage.get();
  },

  async set(amount) {
    await delay(300);
    return await BudgetStorage.set(amount);
  },
};

/**
 * Bills API
 */
export const BillsAPI = {
  async getAll() {
    await delay(300);
    return await BillsStorage.getAll();
  },

  async create(bill) {
    await delay(400);
    return await BillsStorage.save(bill);
  },

  async update(id, updates) {
    await delay(400);
    return await BillsStorage.update(id, updates);
  },

  async delete(id) {
    await delay(300);
    return await BillsStorage.delete(id);
  },
};

/**
 * Bank Sync API
 */
export const BankSyncAPI = {
  async sync() {
    await delay(2000); // Simulate sync delay
    // Mock bank transactions
    const mockTransactions = [
      {
        id: Date.now().toString(),
        amount: -45.50,
        description: 'Payment - Carrefour',
        date: new Date().toISOString(),
        category: 'groceries',
        synced: true,
      },
      {
        id: (Date.now() + 1).toString(),
        amount: -12.00,
        description: 'STEG - Electricity Bill',
        date: new Date().toISOString(),
        category: 'bills',
        synced: true,
      },
    ];
    return {
      success: true,
      transactions: mockTransactions,
      count: mockTransactions.length,
    };
  },

  async getTransactions() {
    await delay(300);
    // Return mock transactions
    return [
      {
        id: '1',
        amount: -45.50,
        description: 'Payment - Carrefour',
        date: new Date(Date.now() - 86400000).toISOString(),
        category: 'groceries',
        synced: true,
      },
      {
        id: '2',
        amount: -12.00,
        description: 'STEG - Electricity Bill',
        date: new Date(Date.now() - 172800000).toISOString(),
        category: 'bills',
        synced: true,
      },
    ];
  },
};

/**
 * Statistics API
 */
export const StatisticsAPI = {
  async getMonthlyStats(year, month) {
    await delay(400);
    const expenses = await ExpensesAPI.getByMonth(year, month);
    
    // Calculate statistics
    const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const byCategory = {};
    
    expenses.forEach((expense) => {
      const cat = expense.category || 'other';
      byCategory[cat] = (byCategory[cat] || 0) + (expense.amount || 0);
    });

    return {
      total,
      count: expenses.length,
      byCategory,
      average: expenses.length > 0 ? total / expenses.length : 0,
    };
  },

  async getTrends(months = 6) {
    await delay(500);
    const trends = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const expenses = await ExpensesAPI.getByMonth(date.getFullYear(), date.getMonth());
      const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      
      trends.push({
        month: date.getMonth(),
        year: date.getFullYear(),
        total,
        count: expenses.length,
      });
    }
    
    return trends;
  },
};

/**
 * Notifications API
 */
export const NotificationsAPI = {
  async getAll() {
    await delay(300);
    // Mock notifications
    return [
      {
        id: '1',
        type: 'budget_warning',
        title: 'Budget Alert',
        message: 'You have used 80% of your monthly budget',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'bill_reminder',
        title: 'Bill Reminder',
        message: 'Electricity bill is due in 3 days',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
  },

  async markAsRead(id) {
    await delay(200);
    return true;
  },
};

export default {
  ExpensesAPI,
  BudgetAPI,
  BillsAPI,
  BankSyncAPI,
  StatisticsAPI,
  NotificationsAPI,
};

