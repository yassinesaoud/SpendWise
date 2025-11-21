/**
 * Welcome / Onboarding Screen
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  // Debug: Log to verify component is rendering
  React.useEffect(() => {
    console.log('✅ WelcomeScreen component loaded');
    console.log('✅ WelcomeScreen rendered', { navigation: !!navigation });
    if (!navigation) {
      console.error('❌ Navigation is missing!');
    }
  }, [navigation]);

  // Fallback if navigation is missing
  if (!navigation) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={styles.errorText}>Navigation Error - Check Console</Text>
        <Text style={{ marginTop: 10, color: '#6E6E73' }}>Navigation prop is missing</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>SW</Text>
          </View>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Bienvenue sur SpendWise</Text>
          <Text style={styles.subtitle}>
            Gérez vos dépenses facilement et prenez le contrôle de vos finances
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, styles.buttonSpacing]}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Créer un compte</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#FFFFFF', // Explicit white background
  },
  errorText: {
    fontSize: 20,
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 50,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  logoContainer: {
    marginBottom: 48,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#233675', // Explicit primary color
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF', // Explicit white
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E', // Explicit text color
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6E6E73', // Explicit text color
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  buttonSpacing: {
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#233675', // Explicit primary color
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF', // Explicit white
  },
  secondaryButton: {
    backgroundColor: '#F5F7FA', // Explicit background color
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA', // Explicit border color
    width: '100%',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#233675', // Explicit primary color
  },
});

export default WelcomeScreen;

