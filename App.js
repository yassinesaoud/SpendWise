/**
 * SpendWise App Entry Point
 */

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  React.useEffect(() => {
    console.log('✅✅✅ App.js EXECUTED');
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <AppNavigator />
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
});
