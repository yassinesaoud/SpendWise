/**
 * Sidebar Menu Component - Beautiful animated sidebar
 */

import { Feather } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Animated, Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = 280;

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route: string;
  color: string;
  badge?: number;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Tableau de bord',
    icon: 'home',
    route: '/(tabs)',
    color: '#233675',
  },
  {
    id: 'expenses',
    title: 'Dépenses',
    icon: 'list',
    route: '/(tabs)/expenses',
    color: '#FF6B6B',
  },
      {
        id: 'statistics',
        title: 'Statistiques',
        icon: 'bar-chart-2',
        route: '/(tabs)/statistics',
        color: '#4ECDC4',
      },
      {
        id: 'heatmap',
        title: 'Carte de chaleur',
        icon: 'grid',
        route: '/heatmap',
        color: '#FF6B6B',
      },
  {
    id: 'budget',
    title: 'Budget',
    icon: 'credit-card',
    route: '/budget',
    color: '#6BCB77',
  },
  {
    id: 'bills',
    title: 'Factures',
    icon: 'file-text',
    route: '/bills',
    color: '#FFD93D',
    badge: 3,
  },
  {
    id: 'bank-sync',
    title: 'Synchronisation',
    icon: 'refresh-cw',
    route: '/bank-sync',
    color: '#3498DB',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'bell',
    route: '/notifications',
    color: '#9B59B6',
    badge: 5,
  },
  {
    id: 'support',
    title: 'Support',
    icon: 'help-circle',
    route: '/support',
    color: '#E67E22',
  },
  {
    id: 'profile',
    title: 'Profil',
    icon: 'user',
    route: '/profile',
    color: '#F38181',
  },
  {
    id: 'settings',
    title: 'Paramètres',
    icon: 'settings',
    route: '/settings',
    color: '#6E6E73',
  },
  {
    id: 'about',
    title: 'À propos',
    icon: 'info',
    route: '/about',
    color: '#95E1D3',
  },
  {
    id: 'chatbot',
    title: 'Assistant IA',
    icon: 'message-circle',
    route: '/chatbot',
    color: '#23A8F2',
  },
  {
    id: 'export',
    title: 'Exporter données',
    icon: 'download',
    route: '/export-data',
    color: '#16A085',
  },
];

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNavigate = (route: string) => {
    router.push(route as any);
    onClose();
  };

  const isActive = (route: string) => {
    if (route === '/(tabs)') {
      return pathname === '/(tabs)' || pathname === '/(tabs)/';
    }
    return pathname === route || pathname?.startsWith(route);
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={[StyleSheet.absoluteFill, { pointerEvents: 'auto' }]}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.sidebarScroll}
          contentContainerStyle={styles.sidebarContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>SW</Text>
              </View>
            </View>
            <Text style={styles.appName}>SpendWise</Text>
            <Text style={styles.appTagline}>Gérez vos finances</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={24} color="#1C1C1E" />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>YM</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Yassine M.</Text>
              <Text style={styles.userEmail}>yassine@example.com</Text>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {MENU_ITEMS.map((item, index) => {
              const active = isActive(item.route);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, active && styles.menuItemActive]}
                  onPress={() => handleNavigate(item.route)}
                  activeOpacity={0.7}
                >
                  <Animated.View
                    style={[
                      styles.menuIconContainer,
                      { backgroundColor: active ? `${item.color}20` : 'transparent' },
                    ]}
                  >
                    <Feather
                      name={item.icon as any}
                      size={20}
                      color={active ? item.color : '#6E6E73'}
                    />
                  </Animated.View>
                  <Text
                    style={[
                      styles.menuText,
                      active && { color: item.color, fontWeight: '600' },
                    ]}
                  >
                    {item.title}
                  </Text>
                  {item.badge && (
                    <View style={[styles.badge, { backgroundColor: item.color }]}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                  {active && (
                    <View style={[styles.activeIndicator, { backgroundColor: item.color }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                onClose();
                // Navigate to welcome screen
                setTimeout(() => {
                  router.replace('/');
                }, 300);
              }}
              activeOpacity={0.7}
            >
              <Feather name="log-out" size={18} color="#E74C3C" />
              <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
    ...(Platform.OS === 'web' ? { boxShadow: '4px 0 20px rgba(0,0,0,0.15)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    }),
  },
  sidebarScroll: {
    flex: 1,
  },
  sidebarContent: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#233675',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 12,
    color: '#6E6E73',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#233675',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#6E6E73',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 12,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: '#F5F7FA',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1E',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '50%',
    width: 4,
    height: 24,
    borderRadius: 2,
    transform: [{ translateY: -12 }],
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    marginBottom: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E74C3C',
  },
  versionText: {
    fontSize: 11,
    color: '#6E6E73',
    textAlign: 'center',
  },
});

