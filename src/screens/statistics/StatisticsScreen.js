/**
 * Statistics Screen
 * Financial statistics with charts
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import Header from '../../components/Header';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { StatisticsAPI, ExpensesAPI } from '../../services/api';
import { getAllCategories } from '../../utils/categories';

const screenWidth = Dimensions.get('window').width;

const StatisticsScreen = ({ navigation }) => {
  const [monthlyStats, setMonthlyStats] = useState({ total: 0, byCategory: {} });
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    const [stats, trendsData] = await Promise.all([
      StatisticsAPI.getMonthlyStats(new Date().getFullYear(), new Date().getMonth()),
      StatisticsAPI.getTrends(6),
    ]);
    setMonthlyStats(stats);
    setTrends(trendsData);
    setLoading(false);
  };

  // Prepare pie chart data
  const pieData = Object.entries(monthlyStats.byCategory || {}).map(([category, amount]) => {
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

  // Prepare bar chart data (monthly trends)
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const barData = {
    labels: trends.map((t) => monthNames[t.month]),
    datasets: [
      {
        data: trends.map((t) => t.total),
      },
    ],
  };

  const chartConfig = {
    backgroundColor: Colors.white,
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(35, 54, 117, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(30, 30, 30, ${opacity})`,
    style: {
      borderRadius: BorderRadius.lg,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Colors.primary,
    },
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Statistiques" onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Statistiques" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total ce mois</Text>
            <Text style={styles.summaryValue}>{monthlyStats.total.toFixed(2)} TND</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Nombre de dépenses</Text>
            <Text style={styles.summaryValue}>{monthlyStats.count || 0}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Moyenne</Text>
            <Text style={styles.summaryValue}>{(monthlyStats.average || 0).toFixed(2)} TND</Text>
          </View>
        </View>

        {/* Pie Chart */}
        {pieData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Répartition par catégorie</Text>
            <PieChart
              data={pieData}
              width={screenWidth - Spacing.xl * 2}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}

        {/* Bar Chart - Trends */}
        {trends.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Tendances (6 derniers mois)</Text>
            <BarChart
              data={barData}
              width={screenWidth - Spacing.xl * 2}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              showValuesOnTopOfBars
              fromZero
            />
          </View>
        )}

        {/* Category Breakdown */}
        {Object.keys(monthlyStats.byCategory || {}).length > 0 && (
          <View style={styles.categoryCard}>
            <Text style={styles.chartTitle}>Détails par catégorie</Text>
            {Object.entries(monthlyStats.byCategory).map(([category, amount]) => {
              const categories = getAllCategories();
              const cat = categories.find((c) => c.id === category) || categories[categories.length - 1];
              const percentage = monthlyStats.total > 0 ? (amount / monthlyStats.total) * 100 : 0;
              return (
                <View key={category} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryIcon, { backgroundColor: `${cat.color}20` }]}>
                      <Text style={[styles.categoryIconText, { color: cat.color }]}>
                        {cat.name.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.categoryName}>{cat.name}</Text>
                      <Text style={styles.categoryPercentage}>{percentage.toFixed(1)}%</Text>
                    </View>
                  </View>
                  <Text style={styles.categoryAmount}>{amount.toFixed(2)} TND</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.small,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
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
  categoryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.small,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  categoryIconText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.bold,
  },
  categoryName: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textPrimary,
  },
  categoryPercentage: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  categoryAmount: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textPrimary,
  },
});

export default StatisticsScreen;

