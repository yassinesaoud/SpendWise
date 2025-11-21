/**
 * Bills Screen
 * Manage bills (upload, list, mark as paid/unpaid)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import Header from '../../components/Header';
import FAB from '../../components/FAB';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { BillsAPI } from '../../services/api';

const BillsScreen = ({ navigation }) => {
  const [bills, setBills] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBills();
    const unsubscribe = navigation.addListener('focus', () => {
      loadBills();
    });
    return unsubscribe;
  }, [navigation]);

  const loadBills = async () => {
    const data = await BillsAPI.getAll();
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setBills(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBills();
    setRefreshing(false);
  };

  const handleUploadBill = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const bill = {
          name: file.name || 'Facture',
          amount: 0,
          dueDate: new Date().toISOString(),
          paid: false,
          fileUri: file.uri,
          fileType: file.mimeType,
        };

        await BillsAPI.create(bill);
        await loadBills();
        Alert.alert('Succès', 'Facture ajoutée avec succès');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter la facture');
    }
  };

  const handleTogglePaid = async (bill) => {
    await BillsAPI.update(bill.id, { paid: !bill.paid });
    await loadBills();
  };

  const handleDeleteBill = (bill) => {
    Alert.alert(
      'Supprimer la facture',
      'Êtes-vous sûr de vouloir supprimer cette facture ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await BillsAPI.delete(bill.id);
            await loadBills();
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderBill = ({ item }) => (
    <View style={styles.billCard}>
      <View style={styles.billHeader}>
        <View style={styles.billInfo}>
          <Feather name="file-text" size={24} color={Colors.primary} />
          <View style={styles.billDetails}>
            <Text style={styles.billName}>{item.name}</Text>
            <Text style={styles.billDate}>Échéance: {formatDate(item.dueDate)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleDeleteBill(item)}>
          <Feather name="trash-2" size={20} color={Colors.danger} />
        </TouchableOpacity>
      </View>
      <View style={styles.billFooter}>
        {item.amount > 0 && (
          <Text style={styles.billAmount}>{item.amount.toFixed(2)} TND</Text>
        )}
        <TouchableOpacity
          style={[styles.paidButton, item.paid && styles.paidButtonActive]}
          onPress={() => handleTogglePaid(item)}
        >
          <Text style={[styles.paidButtonText, item.paid && styles.paidButtonTextActive]}>
            {item.paid ? 'Payé' : 'Non payé'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="file-text" size={64} color={Colors.textSecondary} />
      <Text style={styles.emptyText}>Aucune facture</Text>
      <Text style={styles.emptySubtext}>Appuyez sur le bouton + pour ajouter une facture</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Mes factures" onBack={() => navigation.goBack()} />
      <FlatList
        data={bills}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderBill}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <FAB onPress={handleUploadBill} />
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
  billCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  billInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  billDetails: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  billName: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  billDate: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  billFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billAmount: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.textPrimary,
  },
  paidButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paidButtonActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  paidButtonText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textPrimary,
  },
  paidButtonTextActive: {
    color: Colors.white,
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

export default BillsScreen;

