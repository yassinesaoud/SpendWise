/**
 * Bills Screen - Manage bills with upload functionality
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

// Fake bills data
const FAKE_BILLS = [
  {
    id: '1',
    name: 'Facture STEG',
    amount: 120.00,
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    paid: false,
    fileType: 'application/pdf',
  },
  {
    id: '2',
    name: 'Facture Internet',
    amount: 80.00,
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    paid: true,
    fileType: 'application/pdf',
  },
  {
    id: '3',
    name: 'Facture Eau',
    amount: 45.50,
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    paid: false,
    fileType: 'image/jpeg',
  },
];

export default function BillsScreen() {
  const router = useRouter();
  const [bills, setBills] = useState(FAKE_BILLS);

  const handleUploadBill = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const newBill = {
          id: Date.now().toString(),
          name: file.name || 'Facture',
          amount: 0,
          dueDate: new Date().toISOString(),
          paid: false,
          fileType: file.mimeType || 'application/pdf',
        };
        setBills([newBill, ...bills]);
        Alert.alert('Succès', 'Facture ajoutée avec succès');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter la facture');
    }
  };

  const handleTogglePaid = (bill: typeof FAKE_BILLS[0]) => {
    setBills(bills.map(b => b.id === bill.id ? { ...b, paid: !b.paid } : b));
  };

  const handleDeleteBill = (bill: typeof FAKE_BILLS[0]) => {
    Alert.alert(
      'Supprimer la facture',
      'Êtes-vous sûr de vouloir supprimer cette facture ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => setBills(bills.filter(b => b.id !== bill.id)),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return `Échue (${Math.abs(days)}j)`;
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Demain';
    return `Dans ${days} jours`;
  };

  const getDueDateColor = (dateString: string, paid: boolean) => {
    if (paid) return '#2ECC71';
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return '#E74C3C';
    if (days <= 3) return '#F1C40F';
    return '#6E6E73';
  };

  const unpaidBills = bills.filter(b => !b.paid);
  const totalUnpaid = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Factures</Text>
        <TouchableOpacity onPress={handleUploadBill} style={styles.uploadButton}>
          <Feather name="plus" size={24} color="#233675" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Factures impayées</Text>
            <Text style={styles.summaryValue}>{unpaidBills.length}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total à payer</Text>
            <Text style={[styles.summaryValue, { color: '#E74C3C' }]}>
              {totalUnpaid.toFixed(2)} TND
            </Text>
          </View>
        </View>

        {/* Bills List */}
        <View style={styles.billsSection}>
          <Text style={styles.sectionTitle}>Mes factures</Text>
          {bills.map((bill) => (
            <View key={bill.id} style={styles.billCard}>
              <View style={styles.billHeader}>
                <View style={[styles.billIcon, { backgroundColor: '#FFD93D20' }]}>
                  <Feather
                    name={bill.fileType?.includes('pdf') ? 'file-text' : 'image'}
                    size={24}
                    color="#FFD93D"
                  />
                </View>
                <View style={styles.billInfo}>
                  <Text style={styles.billName}>{bill.name}</Text>
                  <Text style={styles.billAmount}>{bill.amount.toFixed(2)} TND</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.paidButton,
                    bill.paid && styles.paidButtonActive,
                  ]}
                  onPress={() => handleTogglePaid(bill)}
                >
                  <Feather
                    name={bill.paid ? 'check-circle' : 'circle'}
                    size={24}
                    color={bill.paid ? '#2ECC71' : '#E5E5EA'}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.billFooter}>
                <View style={styles.dueDateContainer}>
                  <Feather name="calendar" size={14} color={getDueDateColor(bill.dueDate, bill.paid)} />
                  <Text
                    style={[
                      styles.dueDateText,
                      { color: getDueDateColor(bill.dueDate, bill.paid) },
                    ]}
                  >
                    {formatDate(bill.dueDate)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteBill(bill)}
                  style={styles.deleteButton}
                >
                  <Feather name="trash-2" size={18} color="#E74C3C" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Upload FAB */}
        <TouchableOpacity style={styles.fab} onPress={handleUploadBill} activeOpacity={0.8}>
          <Feather name="upload" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    position: 'relative',
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
  uploadButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6E6E73',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  billsSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  billIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  billName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  billAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#233675',
  },
  paidButton: {
    padding: 8,
  },
  paidButtonActive: {
    // Additional styles if needed
  },
  billFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueDateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    ...(Platform.OS === 'web' ? { 
      position: 'fixed',
      bottom: 24,
      right: 24,
      boxShadow: '0 4px 12px rgba(35,54,117,0.4)',
      zIndex: 1000,
    } : {
      position: 'absolute',
      bottom: 24,
      right: 24,
      shadowColor: '#233675',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 10,
      zIndex: 1000,
    }),
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#233675',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

