/**
 * Spending Prediction Card - Predicts end-of-month spending and budget overshoot
 */

import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCurrency } from '../hooks/useCurrency';
import { useTheme } from '../context/ThemeContext';

interface Expense {
  id: string;
  amount: number;
  date: string;
  category: string;
}

interface SpendingPredictionCardProps {
  expenses: Expense[];
  monthlyBudget: number;
}

export default function SpendingPredictionCard({ expenses, monthlyBudget }: SpendingPredictionCardProps) {
  const { formatAmount } = useCurrency();
  const { colors, isDark } = useTheme();

  const prediction = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = today.getDate();
    const daysRemaining = daysInMonth - currentDay;

    // Filter expenses from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= thirtyDaysAgo;
    });

    // Calculate average daily spending from last 30 days
    const totalSpent = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const daysWithExpenses = Math.min(30, currentDay);
    const avgDailySpending = daysWithExpenses > 0 ? totalSpent / daysWithExpenses : 0;

    // Predict end-of-month spending
    const predictedEndOfMonth = totalSpent + (avgDailySpending * daysRemaining);

    // Calculate if budget will be overshot
    const willOvershoot = predictedEndOfMonth > monthlyBudget;
    const overshootAmount = willOvershoot ? predictedEndOfMonth - monthlyBudget : 0;
    const overshootPercentage = monthlyBudget > 0 ? (overshootAmount / monthlyBudget) * 100 : 0;

    // Calculate category trends
    const categoryTotals: Record<string, number> = {};
    recentExpenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    const topCategoryPercentage = totalSpent > 0 ? (topCategory?.[1] / totalSpent) * 100 : 0;

    return {
      predictedEndOfMonth,
      willOvershoot,
      overshootAmount,
      overshootPercentage,
      avgDailySpending,
      daysRemaining,
      topCategory: topCategory?.[0] || 'N/A',
      topCategoryPercentage,
      currentSpending: totalSpent,
    };
  }, [expenses, monthlyBudget]);

  const styles = createStyles(colors, isDark);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: prediction.willOvershoot ? '#E74C3C20' : '#2ECC7120' }]}>
          <Feather
            name={prediction.willOvershoot ? 'alert-triangle' : 'trending-up'}
            size={20}
            color={prediction.willOvershoot ? '#E74C3C' : '#2ECC71'}
          />
        </View>
        <Text style={styles.title}>Prédiction de fin de mois</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.predictionRow}>
          <Text style={styles.label}>Dépenses prévues</Text>
          <Text style={[styles.value, { color: prediction.willOvershoot ? '#E74C3C' : colors.textPrimary }]}>
            {formatAmount(prediction.predictedEndOfMonth)}
          </Text>
        </View>

        {prediction.willOvershoot && (
          <View style={styles.warningBox}>
            <Feather name="alert-circle" size={16} color="#E74C3C" />
            <Text style={styles.warningText}>
              Dépassement prévu de {formatAmount(prediction.overshootAmount)} ({prediction.overshootPercentage.toFixed(1)}%)
            </Text>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Dépense moyenne/jour</Text>
            <Text style={styles.statValue}>{formatAmount(prediction.avgDailySpending)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Jours restants</Text>
            <Text style={styles.statValue}>{prediction.daysRemaining}</Text>
          </View>
        </View>

        <View style={styles.categoryTrend}>
          <Text style={styles.trendLabel}>Catégorie principale</Text>
          <Text style={styles.trendValue}>{prediction.topCategory} ({prediction.topCategoryPercentage.toFixed(1)}%)</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  content: {
    gap: 12,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E74C3C20',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#E74C3C',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  categoryTrend: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  trendLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  trendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

