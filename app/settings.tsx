/**
 * Settings Screen - App settings with Currency, Theme Customization
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Platform, Modal, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { useCurrency, Currency } from '../src/hooks/useCurrency';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme, setThemeMode, mode } = useTheme();
  const { currency, currencies, changeCurrency, formatAmount } = useCurrency();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [customColor, setCustomColor] = useState('#233675');

  const fontSizes = [12, 14, 16, 18, 20];

  const settingsGroups = [
    {
      title: 'Notifications',
      items: [
        {
          id: 'notifications',
          title: 'Notifications push',
          subtitle: 'Recevoir des alertes et rappels',
          icon: 'bell',
          color: '#233675',
          type: 'switch',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'budget-alerts',
          title: 'Alertes budget',
          subtitle: 'Notifications lorsque le budget est proche',
          icon: 'alert-triangle',
          color: '#F1C40F',
          type: 'switch',
          value: true,
        },
      ],
    },
    {
      title: 'Sécurité',
      items: [
        {
          id: 'biometric',
          title: 'Authentification biométrique',
          subtitle: 'Utiliser Face ID ou Touch ID',
          icon: 'fingerprint',
          color: '#4ECDC4',
          type: 'switch',
          value: biometric,
          onToggle: setBiometric,
        },
        {
          id: 'privacy',
          title: 'Confidentialité',
          subtitle: 'Gérer vos données',
          icon: 'lock',
          color: '#6BCB77',
          type: 'navigate',
          route: '/privacy',
        },
      ],
    },
    {
      title: 'Apparence',
      items: [
        {
          id: 'dark-mode',
          title: 'Mode sombre',
          subtitle: mode === 'auto' ? 'Automatique' : isDark ? 'Activé' : 'Désactivé',
          icon: 'moon',
          color: '#AA96DA',
          type: 'switch',
          value: isDark,
          onToggle: toggleTheme,
        },
        {
          id: 'primary-color',
          title: 'Couleur principale',
          subtitle: customColor,
          icon: 'palette',
          color: customColor,
          type: 'action',
          onPress: () => setShowColorPicker(true),
        },
        {
          id: 'font-size',
          title: 'Taille de police',
          subtitle: `${fontSize}px`,
          icon: 'type',
          color: '#6E6E73',
          type: 'action',
          onPress: () => {
            Alert.alert(
              'Taille de police',
              'Choisissez une taille',
              fontSizes.map((size) => ({
                text: `${size}px`,
                onPress: () => setFontSize(size),
              })).concat([{ text: 'Annuler', style: 'cancel' }])
            );
          },
        },
      ],
    },
    {
      title: 'Monnaie',
      items: [
        {
          id: 'currency',
          title: 'Devise',
          subtitle: `${currency} - ${formatAmount(100, false)}`,
          icon: 'dollar-sign',
          color: '#2ECC71',
          type: 'action',
          onPress: () => setShowCurrencyModal(true),
        },
      ],
    },
    {
      title: 'Synchronisation',
      items: [
        {
          id: 'auto-sync',
          title: 'Synchronisation automatique',
          subtitle: 'Synchroniser automatiquement les transactions',
          icon: 'refresh-cw',
          color: '#3498DB',
          type: 'switch',
          value: autoSync,
          onToggle: setAutoSync,
        },
        {
          id: 'backup',
          title: 'Sauvegarde',
          subtitle: 'Sauvegarder vos données',
          icon: 'cloud',
          color: '#95E1D3',
          type: 'navigate',
          route: '/export-data',
        },
      ],
    },
    {
      title: 'Autre',
      items: [
        {
          id: 'language',
          title: 'Langue',
          subtitle: 'Français',
          icon: 'globe',
          color: '#F38181',
          type: 'navigate',
        },
        {
          id: 'about',
          title: 'À propos',
          subtitle: 'Version 1.0.0',
          icon: 'info',
          color: '#6E6E73',
          type: 'navigate',
          route: '/about',
        },
      ],
    },
  ];

  const styles = createStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupContent}>
              {group.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.settingItem}
                  onPress={() => {
                    if (item.type === 'navigate' && item.route) {
                      router.push(item.route);
                    } else if (item.type === 'action' && item.onPress) {
                      item.onPress();
                    }
                  }}
                  activeOpacity={item.type === 'switch' ? 1 : 0.7}
                >
                  <View style={[styles.settingIcon, { backgroundColor: `${item.color}20` }]}>
                    <Feather name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                  {item.type === 'switch' ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: colors.border, true: item.color }}
                      thumbColor="#FFFFFF"
                    />
                  ) : (
                    <Feather name="chevron-right" size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Currency Selection Modal */}
      <Modal
        visible={showCurrencyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choisir une devise</Text>
              <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
                <Feather name="x" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {currencies.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.currencyOption,
                    currency === curr.code && styles.currencyOptionSelected,
                  ]}
                  onPress={() => {
                    changeCurrency(curr.code);
                    setShowCurrencyModal(false);
                  }}
                >
                  <View style={styles.currencyInfo}>
                    <Text style={styles.currencyCode}>{curr.code}</Text>
                    <Text style={styles.currencyName}>{curr.name}</Text>
                  </View>
                  <Text style={styles.currencySymbol}>{curr.symbol}</Text>
                  {currency === curr.code && (
                    <Feather name="check" size={20} color={colors.primary} style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Couleur principale</Text>
              <TouchableOpacity onPress={() => setShowColorPicker(false)}>
                <Feather name="x" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.colorPickerContainer}>
              <Text style={styles.colorPickerLabel}>Couleurs prédéfinies</Text>
              <View style={styles.colorGrid}>
                {['#233675', '#4062BB', '#23A8F2', '#2ECC71', '#E74C3C', '#F39C12', '#9B59B6', '#E67E22'].map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorOption, { backgroundColor: color }, customColor === color && styles.colorOptionSelected]}
                    onPress={() => {
                      setCustomColor(color);
                      setShowColorPicker(false);
                    }}
                  >
                    {customColor === color && <Feather name="check" size={16} color="#FFFFFF" />}
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.colorPickerLabel}>Couleur personnalisée (HEX)</Text>
              <TextInput
                style={styles.colorInput}
                value={customColor}
                onChangeText={setCustomColor}
                placeholder="#233675"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  group: {
    marginTop: 24,
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  groupContent: {
    backgroundColor: colors.cardBackground,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.background,
  },
  currencyOptionSelected: {
    backgroundColor: `${colors.primary}20`,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  currencyName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 12,
  },
  checkIcon: {
    marginLeft: 8,
  },
  colorPickerContainer: {
    marginTop: 16,
  },
  colorPickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: colors.textPrimary,
  },
  colorInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
