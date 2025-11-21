/**
 * Bank Sync Route - Expo Router
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Fake data
const FAKE_TRANSACTIONS = [
  { id: '1', description: 'Virement reçu', amount: 500.00, date: new Date().toISOString(), category: 'Income' },
  { id: '2', description: 'Paiement carte', amount: -45.50, date: new Date(Date.now() - 86400000).toISOString(), category: 'Food' },
  { id: '3', description: 'Retrait DAB', amount: -200.00, date: new Date(Date.now() - 172800000).toISOString(), category: 'Cash' },
];

export default function BankSyncScreen() {
  const router = useRouter();
  const [transactions] = useState(FAKE_TRANSACTIONS);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync(new Date());
      Alert.alert('Succès', '3 transaction(s) synchronisée(s)');
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Synchronisation bancaire</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sync Button */}
        <View style={styles.syncContainer}>
          <TouchableOpacity
            style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
            onPress={handleSync}
            disabled={syncing}
          >
            {syncing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Feather name="refresh-cw" size={20} color="#FFFFFF" />
                <Text style={styles.syncButtonText}>Synchroniser</Text>
              </>
            )}
          </TouchableOpacity>
          {lastSync && (
            <Text style={styles.lastSyncText}>
              Dernière synchronisation: {formatDate(lastSync.toISOString())}
            </Text>
          )}
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusItem}>
            <Feather name="check-circle" size={20} color="#2ECC71" />
            <Text style={styles.statusText}>Connexion sécurisée</Text>
          </View>
          <View style={styles.statusItem}>
            <Feather name="shield" size={20} color="#233675" />
            <Text style={styles.statusText}>Données cryptées</Text>
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Transactions récentes</Text>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <View style={[styles.iconCircle, { backgroundColor: '#23367520' }]}>
                  <Feather name="credit-card" size={20} color="#233675" />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: transaction.amount < 0 ? '#E74C3C' : '#2ECC71' },
                  ]}
                >
                  {transaction.amount > 0 ? '+' : ''}
                  {transaction.amount.toFixed(2)} TND
                </Text>
              </View>
            </View>
          ))}
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
  syncContainer: {
    padding: 24,
    alignItems: 'center',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#233675',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(35,54,117,0.3)' } : {
      shadowColor: '#233675',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    }),
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lastSyncText: {
    fontSize: 12,
    color: '#6E6E73',
    marginTop: 12,
  },
  statusCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    justifyContent: 'space-around',
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  transactionsSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  transactionCard: {
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
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6E6E73',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

