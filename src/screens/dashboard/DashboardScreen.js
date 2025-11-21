/**
 * Dashboard Screen
 * Main screen with KPIs, charts, and alerts
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { ExpensesAPI, BudgetAPI, StatisticsAPI } from '../../services/api';
import { getAllCategories } from '../../utils/categories';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState({ monthly: 0 });
  const [stats, setStats] = useState({ total: 0, byCategory: {} });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [expensesData, budgetData, statsData] = await Promise.all([
      ExpensesAPI.getAll(),
      BudgetAPI.get(),
      StatisticsAPI.getMonthlyStats(new Date().getFullYear(), new Date().getMonth()),
    ]);
    setExpenses(expensesData);
    setBudget(budgetData);
    setStats(statsData);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const totalSpent = stats.total;
  const budgetRemaining = budget.monthly - totalSpent;
  const budgetPercentage = budget.monthly > 0 ? (totalSpent / budget.monthly) * 100 : 0;

  const getBudgetStatus = () => {
    if (budgetPercentage >= 100) return { color: Colors.danger, label: 'Dépassé' };
    if (budgetPercentage >= 80) return { color: Colors.warning, label: 'Attention' };
    return { color: Colors.success, label: 'OK' };
  };

  const budgetStatus = getBudgetStatus();

  // Prepare chart data
  const chartData = Object.entries(stats.byCategory || {}).map(([category, amount]) => {
    const categories = getAllCategories();
    const cat = categories.find((c) => c.id === category) || categories[categories.length - 1];
    return {
      name: cat.name,
      amount,
      color: cat.color,
      legendFontColor: Colors.textPrimary,
      legendFontSize: 12,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Tableau de bord</Text>
          <Text style={styles.subtitle}>Vue d'ensemble de vos finances</Text>
        </View>

        {/* KPIs */}
        <View style={styles.kpiContainer}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Dépenses du mois</Text>
            <Text style={styles.kpiValue}>{totalSpent.toFixed(2)} TND</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Budget restant</Text>
            <Text style={[styles.kpiValue, { color: budgetStatus.color }]}>
              {budgetRemaining.toFixed(2)} TND
            </Text>
          </View>
        </View>

        {/* Budget Status */}
        {budget.monthly > 0 && (
          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetTitle}>Budget mensuel</Text>
              <View style={[styles.budgetBadge, { backgroundColor: `${budgetStatus.color}20` }]}>
                <Text style={[styles.budgetBadgeText, { color: budgetStatus.color }]}>
                  {budgetStatus.label}
                </Text>
              </View>
            </View>
            <View style={styles.budgetBar}>
              <View
                style={[
                  styles.budgetBarFill,
                  {
                    width: `${Math.min(budgetPercentage, 100)}%`,
                    backgroundColor: budgetStatus.color,
                  },
                ]}
              />
            </View>
            <View style={styles.budgetInfo}>
              <Text style={styles.budgetText}>
                {totalSpent.toFixed(2)} TND / {budget.monthly.toFixed(2)} TND
              </Text>
              <Text style={styles.budgetPercentage}>{budgetPercentage.toFixed(0)}%</Text>
            </View>
          </View>
        )}

        {/* Pie Chart */}
        {chartData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Répartition par catégorie</Text>
            <PieChart
              data={chartData}
              width={screenWidth - Spacing.xl * 2}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              hasLegend
            />
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('AddExpense')}
            >
              <Text style={styles.actionButtonText}>Ajouter dépense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() => navigation.navigate('Budget')}
            >
              <Text style={[styles.actionButtonText, { color: Colors.primary }]}>
                Gérer budget
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  kpiContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
  },
  kpiLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  kpiValue: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.textPrimary,
  },
  budgetCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  budgetTitle: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textPrimary,
  },
  budgetBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  budgetBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
  },
  budgetBar: {
    height: 8,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  budgetBarFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  budgetPercentage: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textPrimary,
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  chartTitle: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  actionsContainer: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.white,
  },
});

export default DashboardScreen;

