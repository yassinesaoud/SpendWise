/**
 * Quick Stats Card - Quick access to key statistics
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../hooks/useCurrency';

interface QuickStatsCardProps {
  totalSpent: number;
  monthlyBudget: number;
  expensesCount: number;
  topCategory: string;
}

export default function QuickStatsCard({ totalSpent, monthlyBudget, expensesCount, topCategory }: QuickStatsCardProps) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { formatAmount } = useCurrency();

  const budgetPercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

  const styles = createStyles(colors, isDark);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Aperçu rapide</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/statistics')}>
          <Feather name="arrow-right" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: `${colors.primary}20` }]}>
            <Feather name="trending-down" size={20} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{formatAmount(totalSpent)}</Text>
          <Text style={styles.statLabel}>Dépenses</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#2ECC7120' }]}>
            <Feather name="target" size={20} color="#2ECC71" />
          </View>
          <Text style={styles.statValue}>{budgetPercentage.toFixed(0)}%</Text>
          <Text style={styles.statLabel}>Budget utilisé</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#4ECDC420' }]}>
            <Feather name="list" size={20} color="#4ECDC4" />
          </View>
          <Text style={styles.statValue}>{expensesCount}</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#FFD93D20' }]}>
            <Feather name="award" size={20} color="#FFD93D" />
          </View>
          <Text style={[styles.statValue, styles.statValueSmall]}>{topCategory}</Text>
          <Text style={styles.statLabel}>Top catégorie</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/monthly-trends')}
        >
          <Feather name="trending-up" size={18} color={colors.primary} />
          <Text style={styles.actionText}>Voir les tendances</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/savings-goals')}
        >
          <Feather name="target" size={18} color="#2ECC71" />
          <Text style={styles.actionText}>Objectifs</Text>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    width: '47%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statValueSmall: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});

