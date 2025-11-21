/**
 * Automatic Expense Categorization Utility
 * Uses keywords and vendor names to suggest categories
 */

import { CATEGORIES, getCategoryById } from './categories';

// Keyword mapping for automatic categorization
const CATEGORY_KEYWORDS = {
  [CATEGORIES.FOOD.id]: [
    'restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'food', 'meal', 'dining',
    'fast food', 'bakery', 'patisserie', 'boulangerie', 'resto', 'cantine',
    'tunis', 'sfax', 'sousse', 'food delivery', 'glovo', 'jump', 'talabat',
  ],
  [CATEGORIES.GROCERIES.id]: [
    'supermarket', 'grocery', 'carrefour', 'monoprix', 'magasin general',
    'supermarché', 'épicerie', 'market', 'store', 'achat', 'provision',
  ],
  [CATEGORIES.TRANSPORT.id]: [
    'taxi', 'uber', 'bolt', 'transport', 'metro', 'bus', 'train', 'gas',
    'essence', 'carburant', 'station', 'parking', 'garage', 'voiture',
    'car', 'fuel', 'petrol',
  ],
  [CATEGORIES.BILLS.id]: [
    'bill', 'facture', 'electricity', 'water', 'internet', 'phone', 'mobile',
    'steg', 'sonede', 'ooredoo', 'orange', 'tunisie telecom', 'utility',
    'internet', 'wifi', 'electricité', 'eau', 'téléphone',
  ],
  [CATEGORIES.ENTERTAINMENT.id]: [
    'cinema', 'movie', 'theater', 'concert', 'music', 'game', 'netflix',
    'spotify', 'streaming', 'entertainment', 'fun', 'party', 'club',
  ],
  [CATEGORIES.HEALTH.id]: [
    'pharmacy', 'pharmacie', 'doctor', 'médecin', 'hospital', 'hôpital',
    'clinic', 'clinique', 'medicine', 'médicament', 'health', 'santé',
    'gym', 'fitness', 'sport', 'exercise',
  ],
  [CATEGORIES.EDUCATION.id]: [
    'school', 'university', 'course', 'book', 'education', 'formation',
    'école', 'université', 'cours', 'livre', 'éducation',
  ],
  [CATEGORIES.SHOPPING.id]: [
    'shop', 'store', 'mall', 'boutique', 'magasin', 'achat', 'purchase',
    'clothing', 'vêtement', 'fashion', 'mode',
  ],
  [CATEGORIES.PERSONAL.id]: [
    'salon', 'barber', 'coiffeur', 'beauty', 'beauté', 'cosmetic', 'cosmétique',
    'personal care', 'soin personnel',
  ],
};

/**
 * Auto-categorize expense based on description and vendor
 * @param {string} description - Expense description
 * @param {string} vendor - Vendor/merchant name
 * @returns {Object} Category object
 */
export const autoCategorize = (description = '', vendor = '') => {
  const searchText = `${description} ${vendor}`.toLowerCase().trim();

  if (!searchText) {
    return CATEGORIES.OTHER;
  }

  // Check each category's keywords
  for (const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return getCategoryById(categoryId);
      }
    }
  }

  // Default to OTHER if no match found
  return CATEGORIES.OTHER;
};

/**
 * Get category suggestions based on partial input
 * @param {string} text - Partial description or vendor name
 * @returns {Array} Array of suggested categories with confidence scores
 */
export const getCategorySuggestions = (text = '') => {
  if (!text.trim()) {
    return [];
  }

  const searchText = text.toLowerCase();
  const suggestions = [];

  for (const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let matches = 0;
    for (const keyword of keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        matches++;
      }
    }

    if (matches > 0) {
      const category = getCategoryById(categoryId);
      suggestions.push({
        category,
        confidence: Math.min(matches / keywords.length, 1),
        matches,
      });
    }
  }

  // Sort by confidence (highest first)
  return suggestions.sort((a, b) => b.confidence - a.confidence);
};

