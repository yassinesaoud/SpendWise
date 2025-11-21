/**
 * Expense List Screen
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../../components/Header';
import ExpenseCard from '../../components/ExpenseCard';
import FAB from '../../components/FAB';
import { Colors, Spacing, Typography } from '../../theme';
import { ExpensesAPI } from '../../services/api';

const ExpenseListScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadExpenses();
    const unsubscribe = navigation.addListener('focus', () => {
      loadExpenses();
    });
    return unsubscribe;
  }, [navigation]);

  const loadExpenses = async () => {
    const data = await ExpensesAPI.getAll();
    // Sort by date (newest first)
    data.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    setExpenses(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExpenses();
    setRefreshing(false);
  };

  const handleExpensePress = (expense) => {
    navigation.navigate('ExpenseDetails', { expenseId: expense.id });
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="file-text" size={64} color={Colors.textSecondary} />
      <Text style={styles.emptyText}>Aucune dépense enregistrée</Text>
      <Text style={styles.emptySubtext}>Appuyez sur le bouton + pour ajouter une dépense</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Mes dépenses" />
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <ExpenseCard expense={item} onPress={() => handleExpensePress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <FAB onPress={() => navigation.navigate('AddExpense')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default ExpenseListScreen;

