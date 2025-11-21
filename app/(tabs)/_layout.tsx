/**
 * Main Layout with Sidebar Navigation
 */

import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Sidebar from '../../src/components/Sidebar';

export default function TabsLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: true,
          header: ({ route }) => (
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setSidebarVisible(true)}
              >
                <Feather name="menu" size={24} color="#1C1C1E" />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Feather
                  name={
                    route.name === 'index'
                      ? 'home'
                      : route.name === 'expenses'
                      ? 'list'
                      : route.name === 'statistics'
                      ? 'bar-chart-2'
                      : 'more-horizontal'
                  }
                  size={20}
                  color="#233675"
                />
              </View>
            </View>
          ),
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="expenses" />
        <Tabs.Screen name="statistics" />
        <Tabs.Screen name="more" />
      </Tabs>

      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
  },
});
