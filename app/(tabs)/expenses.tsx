/**
 * Expenses Screen - Full list of expenses with filters and search
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, FlatList, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

// Extended fake data
const FAKE_EXPENSES = [
  { id: '1', description: 'Courses Carrefour', amount: 125.50, category: 'groceries', date: new Date().toISOString(), vendor: 'Carrefour' },
  { id: '2', description: 'Essence', amount: 80.00, category: 'transport', date: new Date(Date.now() - 86400000).toISOString(), vendor: 'Station Total' },
  { id: '3', description: 'Restaurant Le Gourmet', amount: 45.00, category: 'food', date: new Date(Date.now() - 172800000).toISOString(), vendor: 'Le Gourmet' },
  { id: '4', description: 'Facture STEG', amount: 120.00, category: 'bills', date: new Date(Date.now() - 259200000).toISOString(), vendor: 'STEG' },
  { id: '5', description: 'Cinéma Pathé', amount: 25.00, category: 'entertainment', date: new Date(Date.now() - 345600000).toISOString(), vendor: 'CinéPathé' },
  { id: '6', description: 'Pharmacie', amount: 35.50, category: 'health', date: new Date(Date.now() - 432000000).toISOString(), vendor: 'Pharmacie Centrale' },
  { id: '7', description: 'Café', amount: 8.00, category: 'food', date: new Date(Date.now() - 518400000).toISOString(), vendor: 'Café de Paris' },
  { id: '8', description: 'Uber', amount: 12.00, category: 'transport', date: new Date(Date.now() - 604800000).toISOString(), vendor: 'Uber' },
  { id: '9', description: 'Librairie', amount: 45.00, category: 'education', date: new Date(Date.now() - 691200000).toISOString(), vendor: 'Librairie Al Kitab' },
  { id: '10', description: 'Coiffeur', amount: 30.00, category: 'personal', date: new Date(Date.now() - 777600000).toISOString(), vendor: 'Salon Elite' },
];

const CATEGORIES = {
  food: { name: 'Food & Dining', icon: 'coffee', color: '#E74C3C' },
  transport: { name: 'Transport', icon: 'truck', color: '#3498DB' },
  shopping: { name: 'Shopping', icon: 'shopping-bag', color: '#9B59B6' },
  bills: { name: 'Bills & Utilities', icon: 'file-text', color: '#F39C12' },
  entertainment: { name: 'Entertainment', icon: 'film', color: '#E91E63' },
  health: { name: 'Health & Fitness', icon: 'heart', color: '#2ECC71' },
  education: { name: 'Education', icon: 'book', color: '#16A085' },
  groceries: { name: 'Groceries', icon: 'shopping-cart', color: '#27AE60' },
  personal: { name: 'Personal Care', icon: 'user', color: '#E67E22' },
  other: { name: 'Other', icon: 'more-horizontal', color: '#95A5A6' },
};

export default function ExpensesScreen() {
  const router = useRouter();
  const [expenses] = useState(FAKE_EXPENSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (expense.vendor && expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group expenses by date
  const groupedExpenses = filteredExpenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const dateKey = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(expense);
    return acc;
  }, {});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const renderExpense = ({ item }) => {
    const category = CATEGORIES[item.category] || CATEGORIES.other;
    return (
      <TouchableOpacity
        style={styles.expenseCard}
        onPress={() => router.push(`/expense-details?id=${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={[styles.expenseIcon, { backgroundColor: `${category.color}20` }]}>
          <Feather name={category.icon} size={20} color={category.color} />
        </View>
        <View style={styles.expenseContent}>
          <Text style={styles.expenseDescription}>{item.description}</Text>
          <View style={styles.expenseMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: `${category.color}15` }]}>
              <Text style={[styles.categoryText, { color: category.color }]}>{category.name}</Text>
            </View>
            {item.vendor && <Text style={styles.vendor}>{item.vendor}</Text>}
            <Text style={styles.time}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <Text style={styles.expenseAmount}>-{item.amount.toFixed(2)} TND</Text>
      </TouchableOpacity>
    );
  };

  const renderSection = (date, items) => (
    <View key={date} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionDate}>{date}</Text>
        <Text style={styles.sectionTotal}>
          {items.reduce((sum, e) => sum + e.amount, 0).toFixed(2)} TND
        </Text>
      </View>
      {items.map(item => (
        <View key={item.id}>
          {renderExpense({ item })}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Spacer */}
      <View style={styles.headerSpacer}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Dépenses</Text>
            <Text style={styles.subtitle}>{filteredExpenses.length} dépenses</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-expense')}
          >
            <Feather name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color="#6E6E73" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une dépense..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6E6E73"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color="#6E6E73" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilters}
          contentContainerStyle={styles.categoryFiltersContent}
        >
          <TouchableOpacity
            style={[styles.categoryFilter, !selectedCategory && styles.categoryFilterActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.categoryFilterText, !selectedCategory && styles.categoryFilterTextActive]}>
              Tous
            </Text>
          </TouchableOpacity>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.categoryFilter,
                selectedCategory === key && styles.categoryFilterActive,
                { borderColor: cat.color },
              ]}
              onPress={() => setSelectedCategory(selectedCategory === key ? null : key)}
            >
              <Feather
                name={cat.icon}
                size={16}
                color={selectedCategory === key ? cat.color : '#6E6E73'}
              />
              <Text
                style={[
                  styles.categoryFilterText,
                  selectedCategory === key && { color: cat.color },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Total Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total des dépenses</Text>
        <Text style={styles.summaryAmount}>{totalAmount.toFixed(2)} TND</Text>
      </View>

      {/* Expenses List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {Object.keys(groupedExpenses).length > 0 ? (
          Object.entries(groupedExpenses).map(([date, items]) => renderSection(date, items))
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="file-text" size={64} color="#6E6E73" />
            <Text style={styles.emptyText}>Aucune dépense trouvée</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || selectedCategory ? 'Essayez de modifier vos filtres' : 'Ajoutez votre première dépense'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerSpacer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6E6E73',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#233675',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(35,54,117,0.3)' } : {
      shadowColor: '#233675',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    }),
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  categoryFilters: {
    marginTop: 8,
  },
  categoryFiltersContent: {
    gap: 8,
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  categoryFilterActive: {
    backgroundColor: '#F5F7FA',
  },
  categoryFilterText: {
    fontSize: 14,
    color: '#6E6E73',
    fontWeight: '500',
  },
  categoryFilterTextActive: {
    color: '#233675',
    fontWeight: '600',
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#233675',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 20,
    borderRadius: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(35,54,117,0.3)' } : {
      shadowColor: '#233675',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    }),
  },
  summaryLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  sectionTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6E6E73',
  },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  expenseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expenseContent: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  vendor: {
    fontSize: 12,
    color: '#6E6E73',
  },
  time: {
    fontSize: 12,
    color: '#6E6E73',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6E6E73',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
