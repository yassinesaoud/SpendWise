/**
 * Monthly Trends Screen - View spending trends over months
 */

import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../src/context/ThemeContext';
import { useCurrency } from '../src/hooks/useCurrency';

const { width } = Dimensions.get('window');

interface MonthlyData {
  month: string;
  total: number;
  categories: Record<string, number>;
}

const FAKE_MONTHLY_DATA: MonthlyData[] = [
  {
    month: 'Jan',
    total: 1850,
    categories: { groceries: 450, transport: 320, bills: 280, food: 400, entertainment: 200, other: 200 },
  },
  {
    month: 'Fév',
    total: 2100,
    categories: { groceries: 520, transport: 350, bills: 300, food: 450, entertainment: 250, other: 230 },
  },
  {
    month: 'Mar',
    total: 1950,
    categories: { groceries: 480, transport: 340, bills: 290, food: 420, entertainment: 220, other: 200 },
  },
  {
    month: 'Avr',
    total: 2200,
    categories: { groceries: 550, transport: 380, bills: 320, food: 480, entertainment: 270, other: 200 },
  },
  {
    month: 'Mai',
    total: 2050,
    categories: { groceries: 500, transport: 360, bills: 310, food: 440, entertainment: 240, other: 200 },
  },
  {
    month: 'Juin',
    total: 1900,
    categories: { groceries: 470, transport: 330, bills: 285, food: 410, entertainment: 205, other: 200 },
  },
];

export default function MonthlyTrendsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { formatAmount } = useCurrency();
  const [selectedPeriod, setSelectedPeriod] = useState<'6m' | '12m'>('6m');

  const chartData = useMemo(() => {
    const data = selectedPeriod === '6m' ? FAKE_MONTHLY_DATA : [...FAKE_MONTHLY_DATA, ...FAKE_MONTHLY_DATA];
    return {
      labels: data.map(d => d.month),
      datasets: [{
        data: data.map(d => d.total),
      }],
    };
  }, [selectedPeriod]);

  const getAverage = () => {
    const data = selectedPeriod === '6m' ? FAKE_MONTHLY_DATA : [...FAKE_MONTHLY_DATA, ...FAKE_MONTHLY_DATA];
    const sum = data.reduce((acc, d) => acc + d.total, 0);
    return sum / data.length;
  };

  const getTrend = () => {
    const data = selectedPeriod === '6m' ? FAKE_MONTHLY_DATA : [...FAKE_MONTHLY_DATA, ...FAKE_MONTHLY_DATA];
    if (data.length < 2) return { direction: 'neutral', percentage: 0 };
    const first = data[0].total;
    const last = data[data.length - 1].total;
    const percentage = ((last - first) / first) * 100;
    return {
      direction: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral',
      percentage: Math.abs(percentage),
    };
  };

  const getTopCategory = () => {
    const data = selectedPeriod === '6m' ? FAKE_MONTHLY_DATA : [...FAKE_MONTHLY_DATA, ...FAKE_MONTHLY_DATA];
    const categoryTotals: Record<string, number> = {};
    data.forEach(month => {
      Object.entries(month.categories).forEach(([cat, amount]) => {
        categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
      });
    });
    const top = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    return top ? { name: top[0], amount: top[1] } : null;
  };

  const trend = getTrend();
  const topCategory = getTopCategory();

  const styles = createStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tendances mensuelles</Text>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === '6m' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('6m')}
          >
            <Text style={[styles.periodText, selectedPeriod === '6m' && styles.periodTextActive]}>6M</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === '12m' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('12m')}
          >
            <Text style={[styles.periodText, selectedPeriod === '12m' && styles.periodTextActive]}>12M</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Moyenne mensuelle</Text>
            <Text style={styles.statValue}>{formatAmount(getAverage())}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Tendance</Text>
            <View style={styles.trendContainer}>
              <Feather
                name={trend.direction === 'up' ? 'trending-up' : trend.direction === 'down' ? 'trending-down' : 'minus'}
                size={20}
                color={trend.direction === 'up' ? '#E74C3C' : trend.direction === 'down' ? '#2ECC71' : colors.textSecondary}
              />
              <Text style={[
                styles.trendText,
                { color: trend.direction === 'up' ? '#E74C3C' : trend.direction === 'down' ? '#2ECC71' : colors.textSecondary }
              ]}>
                {trend.percentage.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Évolution des dépenses</Text>
          <BarChart
            data={chartData}
            width={width - 64}
            height={220}
            chartConfig={{
              backgroundColor: colors.cardBackground,
              backgroundGradientFrom: colors.cardBackground,
              backgroundGradientTo: colors.cardBackground,
              decimalPlaces: 0,
              color: (opacity = 1) => colors.primary,
              labelColor: (opacity = 1) => colors.textSecondary,
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.7,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            yAxisLabel=""
            yAxisSuffix=""
            showValuesOnTopOfBars
          />
        </View>

        {/* Top Category */}
        {topCategory && (
          <View style={styles.topCategoryCard}>
            <Feather name="award" size={24} color="#FFD93D" />
            <View style={styles.topCategoryInfo}>
              <Text style={styles.topCategoryLabel}>Catégorie principale</Text>
              <Text style={styles.topCategoryName}>{topCategory.name}</Text>
            </View>
            <Text style={styles.topCategoryAmount}>{formatAmount(topCategory.amount)}</Text>
          </View>
        )}

        {/* Monthly Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail par mois</Text>
          {(selectedPeriod === '6m' ? FAKE_MONTHLY_DATA : [...FAKE_MONTHLY_DATA, ...FAKE_MONTHLY_DATA]).map((month, index) => (
            <View key={index} style={styles.monthCard}>
              <View style={styles.monthHeader}>
                <Text style={styles.monthName}>{month.month}</Text>
                <Text style={styles.monthTotal}>{formatAmount(month.total)}</Text>
              </View>
              <View style={styles.categoryBreakdown}>
                {Object.entries(month.categories).map(([cat, amount]) => (
                  <View key={cat} style={styles.categoryItem}>
                    <Text style={styles.categoryName}>{cat}</Text>
                    <Text style={styles.categoryAmount}>{formatAmount(amount)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
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
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
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
    color: colors.textPrimary,
    marginBottom: 16,
  },
  topCategoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 16,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  topCategoryInfo: {
    flex: 1,
  },
  topCategoryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  topCategoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  topCategoryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
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
  monthCard: {
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
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  monthTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  categoryBreakdown: {
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  categoryName: {
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});

