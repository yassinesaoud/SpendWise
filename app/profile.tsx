/**
 * Profile Route - Enhanced profile with location and more details
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [user, setUser] = useState({
    name: 'Yassine M.',
    email: 'yassine@example.com',
    phone: '+216 12 345 678',
    age: 28,
    location: 'Tunis, Tunisie',
    joinDate: '2024-01-15',
    monthlyBudget: 1500,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            // Clear user data
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleSave = () => {
    setUser(editData);
    setIsEditing(false);
    Alert.alert('Succès', 'Profil mis à jour avec succès');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const menuItems = [
    {
      id: 'settings',
      title: 'Paramètres',
      icon: 'settings',
      color: '#6E6E73',
      route: '/settings',
    },
    {
      id: 'privacy',
      title: 'Confidentialité',
      icon: 'lock',
      color: '#4ECDC4',
      route: null,
    },
    {
      id: 'about',
      title: 'À propos',
      icon: 'info',
      color: '#6BCB77',
      route: '/about',
    },
  ];

  const styles = createStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editHeaderButton}>
            <Feather name="edit" size={20} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSave} style={styles.saveHeaderButton}>
            <Feather name="check" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Text>
            </View>
            <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: colors.primary }]}>
              <Feather name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={editData.name}
              onChangeText={(text) => setEditData({ ...editData, name: text })}
            />
          ) : (
            <Text style={styles.userName}>{user.name}</Text>
          )}
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.memberSince}>
            <Feather name="calendar" size={14} color={colors.textSecondary} />
            <Text style={styles.memberSinceText}>
              Membre depuis {formatDate(user.joinDate)}
            </Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: `${colors.primary}20` }]}>
                <Feather name="mail" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={editData.email}
                    onChangeText={(text) => setEditData({ ...editData, email: text })}
                    keyboardType="email-address"
                  />
                ) : (
                  <Text style={styles.infoValue}>{user.email}</Text>
                )}
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: '#4ECDC420' }]}>
                <Feather name="phone" size={20} color="#4ECDC4" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Téléphone</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={editData.phone}
                    onChangeText={(text) => setEditData({ ...editData, phone: text })}
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.infoValue}>{user.phone}</Text>
                )}
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: '#6BCB7720' }]}>
                <Feather name="calendar" size={20} color="#6BCB77" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Âge</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={editData.age?.toString()}
                    onChangeText={(text) => setEditData({ ...editData, age: Number(text) })}
                    keyboardType="number-pad"
                  />
                ) : (
                  <Text style={styles.infoValue}>{user.age} ans</Text>
                )}
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: '#F39C1220' }]}>
                <Feather name="map-pin" size={20} color="#F39C12" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Localisation</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={editData.location}
                    onChangeText={(text) => setEditData({ ...editData, location: text })}
                    placeholder="Ex: Tunis, Tunisie"
                  />
                ) : (
                  <Text style={styles.infoValue}>{user.location}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Budget Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget</Text>
          <View style={styles.budgetCard}>
            <View style={styles.budgetInfo}>
              <Feather name="credit-card" size={24} color={colors.primary} />
              <View style={styles.budgetDetails}>
                <Text style={styles.budgetLabel}>Budget mensuel</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.budgetInput}
                    value={editData.monthlyBudget?.toString()}
                    onChangeText={(text) => setEditData({ ...editData, monthlyBudget: Number(text) })}
                    keyboardType="decimal-pad"
                  />
                ) : (
                  <Text style={styles.budgetValue}>{user.monthlyBudget} TND</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Options</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => item.route && router.push(item.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                  <Feather name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
                <Feather name="chevron-right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Feather name="log-out" size={20} color="#E74C3C" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SpendWise v1.0.0</Text>
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
  editHeaderButton: {
    padding: 8,
  },
  saveHeaderButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    padding: 32,
    margin: 16,
    borderRadius: 20,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.cardBackground,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberSinceText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  infoCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  infoInput: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 4,
  },
  budgetCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 20,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  budgetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  budgetDetails: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  budgetInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 4,
  },
  menuCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E74C3C',
    gap: 8,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E74C3C',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
