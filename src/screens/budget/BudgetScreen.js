/**
 * Budget Screen
 * Set and track monthly budget
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import Header from '../../components/Header';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { BudgetAPI, ExpensesAPI, StatisticsAPI } from '../../services/api';

const BudgetScreen = ({ navigation }) => {
  const [budget, setBudget] = useState({ monthly: 0 });
  const [newBudget, setNewBudget] = useState('');
  const [stats, setStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [budgetData, statsData] = await Promise.all([
      BudgetAPI.get(),
      StatisticsAPI.getMonthlyStats(new Date().getFullYear(), new Date().getMonth()),
    ]);
    setBudget(budgetData);
    setStats(statsData);
    setNewBudget(budgetData.monthly.toString());
  };

  const handleSaveBudget = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount < 0) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    setLoading(true);
    try {
      await BudgetAPI.set(amount);
      await loadData();
      Alert.alert('Succès', 'Budget mis à jour avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le budget');
    }
    setLoading(false);
  };

  const totalSpent = stats.total;
  const budgetRemaining = budget.monthly - totalSpent;
  const budgetPercentage = budget.monthly > 0 ? (totalSpent / budget.monthly) * 100 : 0;

  const getBudgetStatus = () => {
    if (budgetPercentage >= 100) return { color: Colors.danger, label: 'Dépassé', icon: 'alert-circle' };
    if (budgetPercentage >= 80) return { color: Colors.warning, label: 'Attention', icon: 'alert-triangle' };
    return { color: Colors.success, label: 'Dans les limites', icon: 'check-circle' };
  };

  const status = getBudgetStatus();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Budget mensuel" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        {/* Current Budget Status */}
        {budget.monthly > 0 && (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={[styles.statusIcon, { backgroundColor: `${status.color}20` }]}>
                <Text style={[styles.statusIconText, { color: status.color }]}>
                  {status.label}
                </Text>
              </View>
            </View>
            <View style={styles.budgetBar}>
              <View
                style={[
                  styles.budgetBarFill,
                  {
                    width: `${Math.min(budgetPercentage, 100)}%`,
                    backgroundColor: status.color,
                  },
                ]}
              />
            </View>
            <View style={styles.budgetInfo}>
              <View style={styles.budgetInfoRow}>
                <Text style={styles.budgetInfoLabel}>Dépensé</Text>
                <Text style={styles.budgetInfoValue}>{totalSpent.toFixed(2)} TND</Text>
              </View>
              <View style={styles.budgetInfoRow}>
                <Text style={styles.budgetInfoLabel}>Budget</Text>
                <Text style={styles.budgetInfoValue}>{budget.monthly.toFixed(2)} TND</Text>
              </View>
              <View style={styles.budgetInfoRow}>
                <Text style={[styles.budgetInfoLabel, { color: status.color }]}>Restant</Text>
                <Text style={[styles.budgetInfoValue, { color: status.color }]}>
                  {budgetRemaining.toFixed(2)} TND
                </Text>
              </View>
            </View>
            <Text style={styles.budgetPercentage}>{budgetPercentage.toFixed(1)}% utilisé</Text>
          </View>
        )}

        {/* Set Budget Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Définir le budget mensuel</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Montant (TND)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={newBudget}
              onChangeText={setNewBudget}
              keyboardType="decimal-pad"
            />
          </View>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSaveBudget}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Enregistrement...' : 'Enregistrer le budget'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Conseils</Text>
          <Text style={styles.tipText}>
            • Définissez un budget réaliste basé sur vos revenus
          </Text>
          <Text style={styles.tipText}>
            • Consultez régulièrement vos dépenses pour rester dans les limites
          </Text>
          <Text style={styles.tipText}>
            • Ajustez votre budget si nécessaire selon vos besoins
          </Text>
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
  content: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    margin: Spacing.xl,
    ...Shadows.small,
  },
  statusHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statusIcon: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  statusIconText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
  },
  budgetBar: {
    height: 12,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  budgetBarFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  budgetInfo: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  budgetInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetInfoLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  budgetInfoValue: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textPrimary,
  },
  budgetPercentage: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  formTitle: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.white,
  },
  tipsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.small,
  },
  tipsTitle: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
});

export default BudgetScreen;

