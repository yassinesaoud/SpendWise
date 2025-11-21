/**
 * Budget Route - Expo Router
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BudgetScreen() {
  const router = useRouter();
  const [budget] = useState({ monthly: 1500 });
  const [newBudget, setNewBudget] = useState('1500');
  const [totalSpent] = useState(395.50);

  const handleSaveBudget = () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount < 0) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }
    Alert.alert('Succès', 'Budget mis à jour avec succès');
  };

  const budgetRemaining = budget.monthly - totalSpent;
  const budgetPercentage = budget.monthly > 0 ? (totalSpent / budget.monthly) * 100 : 0;

  const getBudgetStatus = () => {
    if (budgetPercentage >= 100) return { color: '#E74C3C', label: 'Dépassé', icon: 'alert-circle' };
    if (budgetPercentage >= 80) return { color: '#F1C40F', label: 'Attention', icon: 'alert-triangle' };
    return { color: '#2ECC71', label: 'Dans les limites', icon: 'check-circle' };
  };

  const status = getBudgetStatus();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Budget mensuel</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        {budget.monthly > 0 && (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
                <Feather name={status.icon as any} size={16} color={status.color} />
                <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(budgetPercentage, 100)}%`,
                    backgroundColor: status.color,
                  },
                ]}
              />
            </View>
            <View style={styles.budgetInfo}>
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>Dépensé</Text>
                <Text style={styles.budgetValue}>{totalSpent.toFixed(2)} TND</Text>
              </View>
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>Budget</Text>
                <Text style={styles.budgetValue}>{budget.monthly.toFixed(2)} TND</Text>
              </View>
              <View style={styles.budgetRow}>
                <Text style={[styles.budgetLabel, { color: status.color }]}>Restant</Text>
                <Text style={[styles.budgetValue, { color: status.color }]}>
                  {budgetRemaining.toFixed(2)} TND
                </Text>
              </View>
            </View>
            <Text style={styles.percentageText}>{budgetPercentage.toFixed(1)}% utilisé</Text>
          </View>
        )}

        {/* Form */}
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
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveBudget}>
            <Text style={styles.saveButtonText}>Enregistrer le budget</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Conseils</Text>
          <Text style={styles.tipText}>• Définissez un budget réaliste basé sur vos revenus</Text>
          <Text style={styles.tipText}>• Consultez régulièrement vos dépenses</Text>
          <Text style={styles.tipText}>• Ajustez votre budget si nécessaire</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
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
    color: '#1C1C1E',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  statusHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E5EA',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  budgetInfo: {
    gap: 12,
    marginBottom: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetLabel: {
    fontSize: 14,
    color: '#6E6E73',
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  percentageText: {
    fontSize: 12,
    color: '#6E6E73',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  saveButton: {
    backgroundColor: '#233675',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tipsCard: {
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
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#6E6E73',
    marginBottom: 8,
    lineHeight: 20,
  },
});

