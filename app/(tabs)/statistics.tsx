/**
 * Statistics Screen - Financial statistics with charts
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// Fake data
const FAKE_MONTHLY_STATS = {
  total: 395.50,
  count: 10,
  average: 39.55,
  byCategory: {
    groceries: 125.50,
    transport: 92.00,
    food: 53.00,
    bills: 120.00,
    entertainment: 25.00,
  },
};

const FAKE_TRENDS = [
  { month: 5, total: 320.00 },
  { month: 6, total: 380.00 },
  { month: 7, total: 450.00 },
  { month: 8, total: 395.50 },
  { month: 9, total: 420.00 },
  { month: 10, total: 395.50 },
];

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

export default function StatisticsScreen() {
  const router = useRouter();
  const [monthlyStats] = useState(FAKE_MONTHLY_STATS);
  const [trends] = useState(FAKE_TRENDS);

  // Prepare pie chart data
  const pieData = Object.entries(monthlyStats.byCategory || {}).map(([category, amount]) => {
    const cat = (CATEGORIES as Record<string, typeof CATEGORIES.other>)[category] || CATEGORIES.other;
    return {
      name: cat.name,
      amount: amount as number,
      color: cat.color,
      legendFontColor: '#1C1C1E',
      legendFontSize: 12,
    };
  });

  // Prepare bar chart data
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
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(35, 54, 117, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(30, 30, 30, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View style={styles.container}>
      {/* Header Spacer */}
      <View style={styles.headerSpacer}>
        <Text style={styles.title}>Statistiques</Text>
        <Text style={styles.subtitle}>Analyse de vos dépenses</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: '#FF6B6B20' }]}>
              <Feather name="dollar-sign" size={20} color="#FF6B6B" />
            </View>
            <Text style={styles.summaryLabel}>Total ce mois</Text>
            <Text style={styles.summaryValue}>{monthlyStats.total.toFixed(2)} TND</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: '#4ECDC420' }]}>
              <Feather name="list" size={20} color="#4ECDC4" />
            </View>
            <Text style={styles.summaryLabel}>Nombre</Text>
            <Text style={styles.summaryValue}>{monthlyStats.count}</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: '#6BCB7720' }]}>
              <Feather name="trending-up" size={20} color="#6BCB77" />
            </View>
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
              width={screenWidth - 64}
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
              width={screenWidth - 64}
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
              const cat = (CATEGORIES as Record<string, typeof CATEGORIES.other>)[category] || CATEGORIES.other;
              const percentage = monthlyStats.total > 0 ? ((amount as number) / monthlyStats.total) * 100 : 0;
              return (
                <View key={category} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryIcon, { backgroundColor: `${cat.color}20` }]}>
                      <Feather name={cat.icon as any} size={20} color={cat.color} />
                    </View>
                    <View>
                      <Text style={styles.categoryName}>{cat.name}</Text>
                      <Text style={styles.categoryPercentage}>{percentage.toFixed(1)}%</Text>
                    </View>
                  </View>
                  <Text style={styles.categoryAmount}>{(amount as number).toFixed(2)} TND</Text>
                </View>
              );
            })}
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
    padding: 24,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
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
  content: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6E6E73',
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
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
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 32,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
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
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#6E6E73',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
});
