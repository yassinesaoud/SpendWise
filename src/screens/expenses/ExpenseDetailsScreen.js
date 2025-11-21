/**
 * Expense Details Screen
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../../components/Header';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { ExpensesAPI } from '../../services/api';
import { getCategoryById } from '../../utils/categories';

const ExpenseDetailsScreen = ({ navigation, route }) => {
  const { expenseId } = route.params || {};
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    if (expenseId) {
      loadExpense();
    } else {
      // If no expenseId, go back
      navigation.goBack();
    }
  }, [expenseId]);

  const loadExpense = async () => {
    if (!expenseId) return;
    const data = await ExpensesAPI.getById(expenseId);
    setExpense(data);
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la dépense',
      'Êtes-vous sûr de vouloir supprimer cette dépense ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await ExpensesAPI.delete(expenseId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!expense) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Détails" onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const category = getCategoryById(expense.category || 'other');
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Détails de la dépense"
        onBack={() => navigation.goBack()}
        rightAction={handleDelete}
        rightIcon="trash-2"
      />
      <View style={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Montant</Text>
          <Text style={styles.amountValue}>-{Math.abs(expense.amount || 0).toFixed(2)} TND</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{expense.description || 'N/A'}</Text>
          </View>

          {expense.vendor && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vendeur</Text>
              <Text style={styles.detailValue}>{expense.vendor}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Catégorie</Text>
            <View style={styles.categoryContainer}>
              <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                <Feather name={category.icon} size={20} color={category.color} />
              </View>
              <Text style={styles.detailValue}>{category.name}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDate(expense.date || expense.createdAt)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('AddExpense', { expenseId: expense.id })}
        >
          <Feather name="edit-2" size={20} color={Colors.white} />
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>
      </View>
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
    padding: Spacing.xl,
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
  amountContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  amountLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  amountValue: {
    fontSize: Typography.fontSize.xxxl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.danger,
  },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  editButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  editButtonText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.white,
  },
});

export default ExpenseDetailsScreen;

