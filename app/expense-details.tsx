/**
 * Expense Details Screen - With receipt image preview
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { getCategoryById } from '../src/utils/categories';
import { useTheme } from '../src/context/ThemeContext';
import { useCurrency } from '../src/hooks/useCurrency';

// Fake expense data
const FAKE_EXPENSE = {
  id: '1',
  description: 'Courses Carrefour',
  amount: 125.50,
  category: 'groceries',
  vendor: 'Carrefour',
  date: new Date().toISOString(),
  receiptUri: null as string | null,
};

export default function ExpenseDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const expenseId = params.id || '1';
  const { colors, isDark } = useTheme();
  const { formatAmount } = useCurrency();
  const [expense] = useState({ ...FAKE_EXPENSE, receiptUri: params.receiptUri as string | null || null });

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la dépense',
      'Êtes-vous sûr de vouloir supprimer cette dépense ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            // Delete receipt if exists
            if (expense.receiptUri) {
              FileSystem.deleteAsync(expense.receiptUri, { idempotent: true }).catch(console.error);
            }
            // TODO: Delete from storage
            router.back();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push({
      pathname: '/add-expense',
      params: { expenseId: expense.id },
    });
  };

  const handleDeleteReceipt = () => {
    Alert.alert(
      'Supprimer le reçu',
      'Êtes-vous sûr de vouloir supprimer ce reçu ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            if (expense.receiptUri) {
              FileSystem.deleteAsync(expense.receiptUri, { idempotent: true }).catch(console.error);
            }
            // TODO: Update expense in storage
            Alert.alert('Succès', 'Reçu supprimé');
          },
        },
      ]
    );
  };

  const category = getCategoryById(expense.category);
  const styles = createStyles(colors, isDark);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Feather name="edit" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount Card */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Montant</Text>
          <Text style={styles.amountValue}>{formatAmount(expense.amount)}</Text>
        </View>

        {/* Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Feather name="file-text" size={20} color={colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{expense.description}</Text>
            </View>
          </View>

          {expense.vendor && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Feather name="map-pin" size={20} color="#4ECDC4" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Vendeur</Text>
                <Text style={styles.detailValue}>{expense.vendor}</Text>
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <View style={[styles.detailIcon, { backgroundColor: `${category?.color}20` }]}>
              <Feather name={category?.icon as any} size={20} color={category?.color} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Catégorie</Text>
              <Text style={styles.detailValue}>{category?.name || 'Autre'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Feather name="calendar" size={20} color="#F39C12" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(expense.date)}</Text>
            </View>
          </View>
        </View>

        {/* Receipt Image */}
        {expense.receiptUri && (
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <Text style={styles.receiptTitle}>Reçu</Text>
              <TouchableOpacity onPress={handleDeleteReceipt} style={styles.deleteReceiptButton}>
                <Feather name="trash-2" size={18} color="#E74C3C" />
              </TouchableOpacity>
            </View>
            <Image source={{ uri: expense.receiptUri }} style={styles.receiptImage} />
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Feather name="trash-2" size={20} color="#E74C3C" />
            <Text style={styles.deleteButtonText}>Supprimer la dépense</Text>
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
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  amountCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  amountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  detailsCard: {
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  receiptCard: {
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
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  deleteReceiptButton: {
    padding: 8,
  },
  receiptImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  actions: {
    marginBottom: 24,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E74C3C',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E74C3C',
  },
});
