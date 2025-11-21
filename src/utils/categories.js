/**
 * Expense Categories Configuration
 */

export const CATEGORIES = {
  FOOD: {
    id: 'food',
    name: 'Food & Dining',
    icon: 'utensils',
    color: '#E74C3C',
  },
  TRANSPORT: {
    id: 'transport',
    name: 'Transport',
    icon: 'car',
    color: '#3498DB',
  },
  SHOPPING: {
    id: 'shopping',
    name: 'Shopping',
    icon: 'shopping-bag',
    color: '#9B59B6',
  },
  BILLS: {
    id: 'bills',
    name: 'Bills & Utilities',
    icon: 'file-text',
    color: '#F39C12',
  },
  ENTERTAINMENT: {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'film',
    color: '#E91E63',
  },
  HEALTH: {
    id: 'health',
    name: 'Health & Fitness',
    icon: 'heart',
    color: '#2ECC71',
  },
  EDUCATION: {
    id: 'education',
    name: 'Education',
    icon: 'book',
    color: '#16A085',
  },
  GROCERIES: {
    id: 'groceries',
    name: 'Groceries',
    icon: 'shopping-cart',
    color: '#27AE60',
  },
  PERSONAL: {
    id: 'personal',
    name: 'Personal Care',
    icon: 'user',
    color: '#E67E22',
  },
  OTHER: {
    id: 'other',
    name: 'Other',
    icon: 'more-horizontal',
    color: '#95A5A6',
  },
};

export const getCategoryById = (id) => {
  return Object.values(CATEGORIES).find((cat) => cat.id === id) || CATEGORIES.OTHER;
};

export const getAllCategories = () => {
  return Object.values(CATEGORIES);
};

