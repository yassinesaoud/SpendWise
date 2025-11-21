/**
 * Dashboard Screen - Main screen with KPIs, charts, and recent expenses
 */

import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import QuickStatsCard from '../../src/components/QuickStatsCard';
import SpendingPredictionCard from '../../src/components/SpendingPredictionCard';
import { useTheme } from '../../src/context/ThemeContext';
import { useCurrency } from '../../src/hooks/useCurrency';

const screenWidth = Dimensions.get('window').width;

// Fake data
const FAKE_EXPENSES = [
  { id: '1', description: 'Courses Carrefour', amount: 125.50, category: 'groceries', date: new Date().toISOString(), vendor: 'Carrefour' },
  { id: '2', description: 'Essence', amount: 80.00, category: 'transport', date: new Date(Date.now() - 86400000).toISOString(), vendor: 'Station Total' },
  { id: '3', description: 'Restaurant', amount: 45.00, category: 'food', date: new Date(Date.now() - 172800000).toISOString(), vendor: 'Le Gourmet' },
  { id: '4', description: 'Facture EDF', amount: 120.00, category: 'bills', date: new Date(Date.now() - 259200000).toISOString(), vendor: 'STEG' },
  { id: '5', description: 'Cinéma', amount: 25.00, category: 'entertainment', date: new Date(Date.now() - 345600000).toISOString(), vendor: 'CinéPathé' },
];

// Enhanced color palette with vibrant colors
const CATEGORIES = {
  food: { name: 'Food & Dining', icon: 'coffee', color: '#FF6B6B' },
  transport: { name: 'Transport', icon: 'truck', color: '#4ECDC4' },
  shopping: { name: 'Shopping', icon: 'shopping-bag', color: '#A8E6CF' },
  bills: { name: 'Bills & Utilities', icon: 'file-text', color: '#FFD93D' },
  entertainment: { name: 'Entertainment', icon: 'film', color: '#FF8B94' },
  health: { name: 'Health & Fitness', icon: 'heart', color: '#6BCB77' },
  education: { name: 'Education', icon: 'book', color: '#4D96FF' },
  groceries: { name: 'Groceries', icon: 'shopping-cart', color: '#95E1D3' },
  personal: { name: 'Personal Care', icon: 'user', color: '#F38181' },
  other: { name: 'Other', icon: 'more-horizontal', color: '#AA96DA' },
};

export default function DashboardScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { formatAmount } = useCurrency();
  const [refreshing, setRefreshing] = useState(false);
  const [expenses] = useState(FAKE_EXPENSES);

  useEffect(() => {
    console.log('✅ Dashboard rendered');
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Calculate totals
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlyBudget = 1500;
  const budgetRemaining = monthlyBudget - totalSpent;
  const budgetPercentage = (totalSpent / monthlyBudget) * 100;

  // Calculate by category
  const categoryTotals = expenses.reduce((acc: Record<string, number>, expense) => {
    const cat = expense.category || 'other';
    acc[cat] = (acc[cat] || 0) + expense.amount;
    return acc;
  }, {});

  // Prepare chart data
  const chartData = Object.entries(categoryTotals).map(([category, amount]) => {
    const cat = (CATEGORIES as Record<string, typeof CATEGORIES.other>)[category] || CATEGORIES.other;
    return {
      name: cat.name,
      amount: amount as number,
      color: cat.color,
      legendFontColor: '#1C1C1E',
      legendFontSize: 12,
    };
  });

  // Get top category
  const topCategory = Object.entries(categoryTotals).sort((a, b) => (b[1] as number) - (a[1] as number))[0];
  const topCategoryName = topCategory ? ((CATEGORIES as Record<string, typeof CATEGORIES.other>)[topCategory[0]] || CATEGORIES.other).name : 'N/A';

  const getBudgetStatus = () => {
    if (budgetPercentage >= 100) return { color: '#E74C3C', label: 'Dépassé', icon: 'alert-circle' };
    if (budgetPercentage >= 80) return { color: '#F1C40F', label: 'Attention', icon: 'alert-triangle' };
    return { color: '#2ECC71', label: 'OK', icon: 'check-circle' };
  };

  const budgetStatus = getBudgetStatus();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
      {/* Header with greeting */}
      <View style={styles.headerSection}>
        <Text style={styles.greeting}>Bonjour 👋</Text>
        <Text style={styles.title}>Tableau de bord</Text>
      </View>

        {/* KPIs with gradient backgrounds */}
        <View style={styles.kpiContainer}>
          <View style={[styles.kpiCard, styles.kpiCardExpenses]}>
            <View style={styles.kpiHeader}>
              <View style={[styles.kpiIconContainer, { backgroundColor: '#FF6B6B20' }]}>
                <Feather name="trending-down" size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.kpiLabel}>Dépenses du mois</Text>
            </View>
            <Text style={[styles.kpiValue, { color: '#FF6B6B' }]}>{totalSpent.toFixed(2)} TND</Text>
            <Text style={styles.kpiChange}>+12% vs mois dernier</Text>
          </View>
          <View style={[styles.kpiCard, styles.kpiCardBudget]}>
            <View style={styles.kpiHeader}>
              <View style={[styles.kpiIconContainer, { backgroundColor: `${budgetStatus.color}20` }]}>
                <Feather name="credit-card" size={20} color={budgetStatus.color} />
              </View>
              <Text style={styles.kpiLabel}>Budget restant</Text>
            </View>
            <Text style={[styles.kpiValue, { color: budgetStatus.color }]}>
              {budgetRemaining.toFixed(2)} TND
            </Text>
            <Text style={styles.kpiChange}>{budgetPercentage.toFixed(0)}% utilisé</Text>
          </View>
        </View>

        {/* Budget Status Card */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <View>
              <Text style={styles.budgetLabel}>Budget mensuel</Text>
              <Text style={styles.budgetAmount}>{monthlyBudget} TND</Text>
            </View>
            <View style={[styles.budgetStatusBadge, { backgroundColor: `${budgetStatus.color}20` }]}>
              <Feather name={budgetStatus.icon as any} size={16} color={budgetStatus.color} />
              <Text style={[styles.budgetStatusText, { color: budgetStatus.color }]}>
                {budgetStatus.label}
              </Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(budgetPercentage, 100)}%`,
                  backgroundColor: budgetStatus.color,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {budgetPercentage.toFixed(1)}% utilisé ({totalSpent.toFixed(2)} / {monthlyBudget} TND)
          </Text>
        </View>

        {/* Quick Stats */}
        <QuickStatsCard
          totalSpent={totalSpent}
          monthlyBudget={monthlyBudget}
          expensesCount={expenses.length}
          topCategory={topCategoryName}
        />

        {/* Spending Prediction */}
        <SpendingPredictionCard expenses={expenses} monthlyBudget={monthlyBudget} />

        {/* Chart */}
        {chartData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Répartition par catégorie</Text>
            <PieChart
              data={chartData}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}

        {/* Recent Expenses */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dépenses récentes</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/expenses')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {expenses.slice(0, 5).map((expense) => {
            const category = (CATEGORIES as Record<string, typeof CATEGORIES.other>)[expense.category] || CATEGORIES.other;
            return (
              <TouchableOpacity
                key={expense.id}
                style={styles.expenseCard}
                onPress={() => router.push(`/expense-details?id=${expense.id}`)}
                activeOpacity={0.7}
              >
                <View style={[styles.expenseIcon, { backgroundColor: `${category.color}20` }]}>
                  <Feather name={category.icon as any} size={20} color={category.color} />
                </View>
                <View style={styles.expenseContent}>
                  <Text style={styles.expenseDescription}>{expense.description}</Text>
                  <Text style={styles.expenseMeta}>
                    {category.name} • {formatDate(expense.date)}
                  </Text>
                </View>
                <Text style={styles.expenseAmount}>-{expense.amount.toFixed(2)} TND</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/add-expense')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#23367520' }]}>
              <Feather name="plus" size={24} color="#233675" />
            </View>
            <Text style={styles.actionText}>Ajouter dépense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/statistics')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#2ECC7120' }]}>
              <Feather name="bar-chart-2" size={24} color="#2ECC71" />
            </View>
            <Text style={styles.actionText}>Statistiques</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Expense FAB - Fixed position */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-expense')}
        activeOpacity={0.8}
      >
        <Feather name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerSection: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 16,
    color: '#6E6E73',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  kpiContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 16,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  kpiCardExpenses: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  kpiCardBudget: {
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  kpiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#6E6E73',
    fontWeight: '500',
    flex: 1,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  kpiChange: {
    fontSize: 11,
    color: '#6E6E73',
    fontWeight: '500',
  },
  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#6E6E73',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  budgetStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  budgetStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6E6E73',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  recentSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  seeAllText: {
    fontSize: 14,
    color: '#233675',
    fontWeight: '600',
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
    marginBottom: 4,
  },
  expenseMeta: {
    fontSize: 12,
    color: '#6E6E73',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  fab: {
    ...(Platform.OS === 'web' ? { 
      position: 'fixed',
      bottom: 24,
      right: 24,
      boxShadow: '0 4px 12px rgba(35,54,117,0.4)',
      zIndex: 1000,
    } : {
      position: 'absolute',
      bottom: 24,
      right: 24,
      shadowColor: '#233675',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 10,
      zIndex: 1000,
    }),
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#233675',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
