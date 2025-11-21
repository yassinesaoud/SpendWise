/**
 * Header Component
 * Reusable header with title and optional actions
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../theme';

const Header = ({ title, onBack, rightAction, rightIcon = 'more-vertical' }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
        {rightAction && (
          <TouchableOpacity onPress={rightAction} style={styles.rightButton}>
            <Feather name={rightIcon} size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        )}
        {!rightAction && onBack && <View style={styles.placeholder} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.white,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  rightButton: {
    padding: Spacing.sm,
  },
  placeholder: {
    width: 40,
  },
});

export default Header;

