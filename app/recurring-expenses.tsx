/**
 * Recurring Expenses Screen - Manage subscriptions and recurring bills
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { useCurrency } from '../src/hooks/useCurrency';

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDue: string;
  isActive: boolean;
  icon: string;
  color: string;
}

const FAKE_RECURRING: RecurringExpense[] = [
  {
    id: '1',
    name: 'Netflix',
    amount: 25.99,
    category: 'entertainment',
    frequency: 'monthly',
    nextDue: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    icon: 'tv',
    color: '#E50914',
  },
  {
    id: '2',
    name: 'Spotify Premium',
    amount: 12.99,
    category: 'entertainment',
    frequency: 'monthly',
    nextDue: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    icon: 'music',
    color: '#1DB954',
  },
  {
    id: '3',
    name: 'Gym Membership',
    amount: 80.00,
    category: 'health',
    frequency: 'monthly',
    nextDue: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    icon: 'activity',
    color: '#FF6B6B',
  },
  {
    id: '4',
    name: 'Internet',
    amount: 45.00,
    category: 'bills',
    frequency: 'monthly',
    nextDue: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    icon: 'wifi',
    color: '#4ECDC4',
  },
];

export default function RecurringExpensesScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { formatAmount } = useCurrency();
  const [expenses, setExpenses] = useState<RecurringExpense[]>(FAKE_RECURRING);

  const toggleExpense = (id: string) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, isActive: !exp.isActive } : exp
    ));
  };

  const getTotalMonthly = () => {
    return expenses
      .filter(exp => exp.isActive)
      .reduce((sum, exp) => {
        if (exp.frequency === 'monthly') return sum + exp.amount;
        if (exp.frequency === 'weekly') return sum + (exp.amount * 4.33);
        if (exp.frequency === 'yearly') return sum + (exp.amount / 12);
        return sum + (exp.amount * 30);
      }, 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'En retard';
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Demain';
    if (diffDays <= 7) return `Dans ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel',
      yearly: 'Annuel',
    };
    return labels[freq] || freq;
  };

  const styles = createStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dépenses récurrentes</Text>
        <TouchableOpacity onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}>
          <Feather name="plus" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total mensuel</Text>
          <Text style={styles.summaryAmount}>{formatAmount(getTotalMonthly())}</Text>
          <Text style={styles.summarySubtext}>
            {expenses.filter(e => e.isActive).length} dépenses actives
          </Text>
        </View>

        {/* Expenses List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abonnements et factures</Text>
          {expenses.map((expense) => (
            <View key={expense.id} style={styles.expenseCard}>
              <View style={[styles.expenseIcon, { backgroundColor: `${expense.color}20` }]}>
                <Feather name={expense.icon as any} size={24} color={expense.color} />
              </View>
              <View style={styles.expenseInfo}>
                <View style={styles.expenseHeader}>
                  <Text style={styles.expenseName}>{expense.name}</Text>
                  <Text style={styles.expenseAmount}>{formatAmount(expense.amount)}</Text>
                </View>
                <View style={styles.expenseMeta}>
                  <Text style={styles.expenseFrequency}>{getFrequencyLabel(expense.frequency)}</Text>
                  <Text style={styles.expenseSeparator}>•</Text>
                  <Text style={[
                    styles.expenseDue,
                    formatDate(expense.nextDue) === 'En retard' && styles.expenseDueOverdue
                  ]}>
                    {formatDate(expense.nextDue)}
                  </Text>
                </View>
              </View>
              <Switch
                value={expense.isActive}
                onValueChange={() => toggleExpense(expense.id)}
                trackColor={{ false: colors.border, true: expense.color }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="plus-circle" size={24} color={colors.primary} />
            <Text style={styles.actionText}>Ajouter une dépense récurrente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
    backgroundColor: colors.cardBackground,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  expenseIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseFrequency: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  expenseSeparator: {
    fontSize: 12,
    color: colors.textSecondary,
    marginHorizontal: 8,
  },
  expenseDue: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  expenseDueOverdue: {
    color: '#E74C3C',
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
});

