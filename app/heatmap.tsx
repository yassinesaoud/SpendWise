/**
 * Heatmap Screen - Visualize spending by category and day
 */

import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { useCurrency } from '../src/hooks/useCurrency';
// SVG import removed - using View components instead

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 64) / 31; // 31 days max
const CATEGORY_HEIGHT = 50;

interface Expense {
  id: string;
  amount: number;
  date: string;
  category: string;
}

// Fake data for demonstration
const FAKE_EXPENSES: Expense[] = Array.from({ length: 100 }, (_, i) => ({
  id: `${i}`,
  amount: Math.random() * 200 + 10,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  category: ['groceries', 'food', 'transport', 'bills', 'entertainment', 'shopping'][Math.floor(Math.random() * 6)],
}));

const CATEGORIES = [
  { id: 'groceries', name: 'Courses', color: '#FF6B6B' },
  { id: 'food', name: 'Restaurant', color: '#4ECDC4' },
  { id: 'transport', name: 'Transport', color: '#45B7D1' },
  { id: 'bills', name: 'Factures', color: '#FFA07A' },
  { id: 'entertainment', name: 'Divertissement', color: '#98D8C8' },
  { id: 'shopping', name: 'Shopping', color: '#F7DC6F' },
];

export default function HeatmapScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { formatAmount } = useCurrency();

  const heatmapData = useMemo(() => {
    const data: Record<string, Record<number, number>> = {};
    const maxAmount = Math.max(...FAKE_EXPENSES.map((e) => e.amount), 1);

    // Initialize categories
    CATEGORIES.forEach((cat) => {
      data[cat.id] = {};
    });

    // Process expenses
    FAKE_EXPENSES.forEach((expense) => {
      const date = new Date(expense.date);
      const day = date.getDate();
      const category = expense.category;

      if (data[category]) {
        data[category][day] = (data[category][day] || 0) + expense.amount;
      }
    });

    return { data, maxAmount };
  }, []);

  const getIntensity = (amount: number, maxAmount: number): number => {
    if (amount === 0) return 0;
    return Math.min(1, amount / maxAmount);
  };

  const getColor = (intensity: number, baseColor: string): string => {
    if (intensity === 0) return colors.border;
    const opacity = 0.3 + intensity * 0.7;
    return baseColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
  };

  const styles = createStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carte de chaleur</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Feather name="info" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            L'intensité de la couleur indique le montant dépensé. Plus foncé = plus dépensé.
          </Text>
        </View>

        <View style={styles.heatmapContainer}>
          {/* Day labels */}
          <View style={styles.dayLabels}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <Text key={day} style={styles.dayLabel}>
                {day}
              </Text>
            ))}
          </View>

          {/* Category rows */}
          {CATEGORIES.map((category) => {
            const categoryData = heatmapData.data[category.id] || {};
            return (
              <View key={category.id} style={styles.categoryRow}>
                <View style={styles.categoryLabel}>
                  <View style={[styles.categoryColorDot, { backgroundColor: category.color }]} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <View style={styles.cellsContainer}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const amount = categoryData[day] || 0;
                    const intensity = getIntensity(amount, heatmapData.maxAmount);
                    const cellColor = getColor(intensity, category.color);

                    return (
                      <TouchableOpacity
                        key={day}
                        style={[styles.cell, { backgroundColor: cellColor }]}
                        onPress={() => {
                          if (amount > 0) {
                            // Show details
                          }
                        }}
                      >
                        {amount > 0 && (
                          <Text style={styles.cellText}>{Math.floor(amount)}</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Légende</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendCell, { backgroundColor: colors.border }]} />
              <Text style={styles.legendText}>Aucune dépense</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendCell, { backgroundColor: '#FF6B6B80' }]} />
              <Text style={styles.legendText}>Faible</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendCell, { backgroundColor: '#FF6B6BCC' }]} />
              <Text style={styles.legendText}>Moyen</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendCell, { backgroundColor: '#FF6B6BFF' }]} />
              <Text style={styles.legendText}>Élevé</Text>
            </View>
          </View>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}20`,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  heatmapContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  dayLabels: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 100,
  },
  dayLabel: {
    width: CELL_SIZE,
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  categoryLabel: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  cellsContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: 2,
  },
  cell: {
    width: CELL_SIZE - 2,
    height: CELL_SIZE - 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 8,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  legend: {
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
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendCell: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

