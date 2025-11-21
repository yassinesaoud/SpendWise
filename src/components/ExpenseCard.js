/**
 * Expense Card Component
 * Displays expense information in a card format
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '../theme';
import { getCategoryById } from '../utils/categories';

const ExpenseCard = ({ expense, onPress }) => {
  const category = getCategoryById(expense.category || 'other');
  const amount = expense.amount || 0;
  const formattedAmount = Math.abs(amount).toFixed(2);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, { backgroundColor: `${category.color}20` }]}>
          <Feather name={category.icon} size={20} color={category.color} />
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.description} numberOfLines={1}>
            {expense.description || 'No description'}
          </Text>
          <Text style={styles.amount}>-{formattedAmount} TND</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
          {expense.vendor && (
            <Text style={styles.vendor} numberOfLines={1}>
              {expense.vendor}
            </Text>
          )}
          <Text style={styles.date}>{formatDate(expense.date || expense.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  description: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  amount: {
    fontSize: Typography.fontSize.md,
    fontWeight: 'bold',
    color: Colors.danger,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  categoryText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  vendor: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
    flex: 1,
  },
  date: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
});

export default ExpenseCard;

