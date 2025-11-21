/**
 * Floating Action Button Component
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows } from '../theme';

const FAB = ({ onPress, icon = 'plus', size = 56 }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.fab, { width: size, height: size, borderRadius: size / 2 }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Feather name={icon} size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 1000,
  },
  fab: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.large,
  },
});

export default FAB;

