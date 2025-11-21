/**
 * More Screen - Settings, notifications, and additional features
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

// Fake notifications data
const FAKE_NOTIFICATIONS = [
  {
    id: '1',
    type: 'budget',
    title: 'Budget presque épuisé',
    message: 'Vous avez utilisé 85% de votre budget mensuel',
    time: 'Il y a 2 heures',
    read: false,
    icon: 'alert-triangle',
    color: '#F1C40F',
  },
  {
    id: '2',
    type: 'bill',
    title: 'Facture à payer',
    message: 'Votre facture STEG est due dans 3 jours',
    time: 'Il y a 5 heures',
    read: false,
    icon: 'file-text',
    color: '#F39C12',
  },
  {
    id: '3',
    type: 'sync',
    title: 'Synchronisation réussie',
    message: '15 nouvelles transactions ont été importées',
    time: 'Hier',
    read: true,
    icon: 'check-circle',
    color: '#2ECC71',
  },
  {
    id: '4',
    type: 'expense',
    title: 'Dépense importante',
    message: 'Vous avez dépensé 250 TND aujourd\'hui',
    time: 'Hier',
    read: true,
    icon: 'trending-up',
    color: '#E74C3C',
  },
];

const MENU_ITEMS = [
  {
    id: 'budget',
    title: 'Budget',
    icon: 'credit-card',
    color: '#233675',
    route: '/budget',
  },
  {
    id: 'statistics',
    title: 'Statistiques',
    icon: 'bar-chart-2',
    color: '#2ECC71',
    route: '/(tabs)/statistics',
  },
  {
    id: 'bills',
    title: 'Factures',
    icon: 'file-text',
    color: '#F39C12',
    route: '/bills',
  },
  {
    id: 'bank-sync',
    title: 'Synchronisation bancaire',
    icon: 'refresh-cw',
    color: '#3498DB',
    route: '/bank-sync',
  },
  {
    id: 'support',
    title: 'Support',
    icon: 'help-circle',
    color: '#9B59B6',
    route: '/support',
  },
  {
    id: 'profile',
    title: 'Profil',
    icon: 'user',
    color: '#E67E22',
    route: '/profile',
  },
  {
    id: 'settings',
    title: 'Paramètres',
    icon: 'settings',
    color: '#6E6E73',
    route: '/settings',
  },
];

export default function MoreScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(FAKE_NOTIFICATIONS);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const renderNotification = (notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationCard,
        !notification.read && styles.notificationCardUnread,
      ]}
      onPress={() => markAsRead(notification.id)}
    >
      <View style={[styles.notificationIcon, { backgroundColor: `${notification.color}20` }]}>
        <Feather name={notification.icon} size={20} color={notification.color} />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          {!notification.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.notificationTime}>{notification.time}</Text>
      </View>
      <TouchableOpacity
        onPress={() => deleteNotification(notification.id)}
        style={styles.deleteButton}
      >
        <Feather name="x" size={18} color="#6E6E73" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Spacer */}
      <View style={styles.headerSpacer}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Plus</Text>
            <Text style={styles.subtitle}>Paramètres et notifications</Text>
          </View>
          <View style={styles.notificationBadgeContainer}>
            <TouchableOpacity style={styles.notificationButton}>
              <Feather name="bell" size={24} color="#1C1C1E" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllAsRead}>
                <Text style={styles.markAllReadText}>Tout marquer comme lu</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Notification Toggle */}
          <View style={styles.toggleCard}>
            <View style={styles.toggleContent}>
              <Feather name="bell" size={20} color="#233675" />
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>Notifications push</Text>
                <Text style={styles.toggleSubtitle}>Recevoir des alertes et rappels</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E5EA', true: '#233675' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <View style={styles.notificationsList}>
              {notifications.map(renderNotification)}
            </View>
          ) : (
            <View style={styles.emptyNotifications}>
              <Feather name="bell-off" size={48} color="#6E6E73" />
              <Text style={styles.emptyText}>Aucune notification</Text>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <View style={styles.menuGrid}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => item.route && router.push(item.route)}
              >
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                  <Feather name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.accountCard}
            onPress={() => router.push('/profile')}
            activeOpacity={0.7}
          >
            <View style={styles.accountAvatar}>
              <Text style={styles.accountAvatarText}>YM</Text>
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>Yassine M.</Text>
              <Text style={styles.accountEmail}>yassine@example.com</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#6E6E73" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SpendWise v1.0.0</Text>
          <Text style={styles.footerSubtext}>Gérez vos finances intelligemment</Text>
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
  headerSpacer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6E6E73',
  },
  notificationBadgeContainer: {
    position: 'relative',
  },
  notificationButton: {
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  markAllReadText: {
    fontSize: 14,
    color: '#233675',
    fontWeight: '600',
  },
  toggleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleTextContainer: {
    gap: 4,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  toggleSubtitle: {
    fontSize: 12,
    color: '#6E6E73',
  },
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#233675',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#233675',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6E6E73',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6E6E73',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyNotifications: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  emptyText: {
    fontSize: 14,
    color: '#6E6E73',
    marginTop: 12,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuItem: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  accountAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#233675',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  accountAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  accountEmail: {
    fontSize: 14,
    color: '#6E6E73',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: 48,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#6E6E73',
  },
});
