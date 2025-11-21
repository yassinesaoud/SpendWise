/**
 * Bank Sync Screen
 * Synchronize bank transactions
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../../components/Header';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';
import { BankSyncAPI } from '../../services/api';

const BankSyncScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const data = await BankSyncAPI.getTransactions();
    setTransactions(data);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await BankSyncAPI.sync();
      if (result.success) {
        setLastSync(new Date());
        await loadTransactions();
        Alert.alert('Succès', `${result.count} transaction(s) synchronisée(s)`);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de synchroniser les transactions');
    }
    setSyncing(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <View style={[styles.iconCircle, { backgroundColor: `${Colors.primary}20` }]}>
            <Feather name="credit-card" size={20} color={Colors.primary} />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <Text style={[styles.transactionAmount, { color: item.amount < 0 ? Colors.danger : Colors.success }]}>
          {item.amount > 0 ? '+' : ''}{item.amount.toFixed(2)} TND
        </Text>
      </View>
      {item.category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="refresh-cw" size={64} color={Colors.textSecondary} />
      <Text style={styles.emptyText}>Aucune transaction</Text>
      <Text style={styles.emptySubtext}>
        Synchronisez vos comptes bancaires pour voir vos transactions
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Synchronisation bancaire" onBack={() => navigation.goBack()} />
      
      {/* Sync Button */}
      <View style={styles.syncContainer}>
        <TouchableOpacity
          style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
          onPress={handleSync}
          disabled={syncing}
          activeOpacity={0.8}
        >
          {syncing ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Feather name="refresh-cw" size={20} color={Colors.white} />
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
          <Feather name="check-circle" size={20} color={Colors.success} />
          <Text style={styles.statusText}>Connexion sécurisée</Text>
        </View>
        <View style={styles.statusItem}>
          <Feather name="shield" size={20} color={Colors.primary} />
          <Text style={styles.statusText}>Données cryptées</Text>
        </View>
      </View>

      {/* Transactions List */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderTransaction}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  syncContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.small,
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncButtonText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.white,
  },
  lastSyncText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  statusCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    justifyContent: 'space-around',
    ...Shadows.small,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textPrimary,
  },
  listContent: {
    padding: Spacing.md,
  },
  transactionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  transactionInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  transactionDate: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.bold,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
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

export default BankSyncScreen;

