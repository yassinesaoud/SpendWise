/**
 * More Screen
 * Menu with additional options
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../theme';

const MoreScreen = ({ navigation }) => {
  const menuItems = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'bell',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      id: 'bills',
      title: 'Mes factures',
      icon: 'file-text',
      onPress: () => navigation.navigate('Bills'),
    },
    {
      id: 'bankSync',
      title: 'Synchronisation bancaire',
      icon: 'refresh-cw',
      onPress: () => navigation.navigate('BankSync'),
    },
    {
      id: 'support',
      title: 'Support',
      icon: 'help-circle',
      onPress: () => navigation.navigate('Support'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Plus</Text>
      </View>
      <ScrollView style={styles.content}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Feather name={item.icon} size={24} color={Colors.primary} />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Feather name="chevron-right" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    padding: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuItemText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
});

export default MoreScreen;

