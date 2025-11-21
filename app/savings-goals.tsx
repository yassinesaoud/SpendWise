/**
 * Savings Goals Screen - Track savings goals and progress
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { useCurrency } from '../src/hooks/useCurrency';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
}

const FAKE_GOALS: SavingsGoal[] = [
  {
    id: '1',
    name: 'Vacances d\'été',
    targetAmount: 2000,
    currentAmount: 850,
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    icon: 'sun',
    color: '#FFD93D',
  },
  {
    id: '2',
    name: 'Nouveau téléphone',
    targetAmount: 1200,
    currentAmount: 600,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    icon: 'smartphone',
    color: '#4ECDC4',
  },
  {
    id: '3',
    name: 'Urgence',
    targetAmount: 5000,
    currentAmount: 3200,
    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    icon: 'shield',
    color: '#6BCB77',
  },
];

export default function SavingsGoalsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { formatAmount } = useCurrency();
  const [goals, setGoals] = useState<SavingsGoal[]>(FAKE_GOALS);

  const getProgress = (goal: SavingsGoal) => {
    return Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const date = new Date(deadline);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTotalSaved = () => {
    return goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  };

  const getTotalTarget = () => {
    return goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  };

  const styles = createStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Objectifs d'épargne</Text>
        <TouchableOpacity onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}>
          <Feather name="plus" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total épargné</Text>
          <Text style={styles.summaryAmount}>{formatAmount(getTotalSaved())}</Text>
          <View style={styles.summaryProgress}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(getTotalSaved() / getTotalTarget()) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.summarySubtext}>
              {formatAmount(getTotalSaved())} / {formatAmount(getTotalTarget())}
            </Text>
          </View>
        </View>

        {/* Goals List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes objectifs</Text>
          {goals.map((goal) => {
            const progress = getProgress(goal);
            const daysRemaining = getDaysRemaining(goal.deadline);
            return (
              <View key={goal.id} style={styles.goalCard}>
                <View style={[styles.goalIcon, { backgroundColor: `${goal.color}20` }]}>
                  <Feather name={goal.icon as any} size={28} color={goal.color} />
                </View>
                <View style={styles.goalInfo}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalAmount}>
                      {formatAmount(goal.currentAmount)} / {formatAmount(goal.targetAmount)}
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${progress}%`,
                          backgroundColor: goal.color,
                        }
                      ]} 
                    />
                  </View>
                  <View style={styles.goalMeta}>
                    <Text style={styles.goalProgress}>{progress.toFixed(0)}% complété</Text>
                    <Text style={styles.goalDeadline}>
                      {daysRemaining > 0 ? `${daysRemaining} jours restants` : 'Échéance dépassée'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="target" size={24} color={colors.primary} />
            <Text style={styles.actionText}>Créer un nouvel objectif</Text>
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
    marginBottom: 16,
  },
  summaryProgress: {
    width: '100%',
  },
  summarySubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
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
  goalCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  goalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  goalInfo: {
    flex: 1,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  goalAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  goalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalProgress: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  goalDeadline: {
    fontSize: 12,
    color: colors.textSecondary,
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

