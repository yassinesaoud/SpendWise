/**
 * Welcome Screen - Entry Point
 */

import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  React.useEffect(() => {
    console.log('✅✅✅ WelcomeScreen rendered with expo-router!');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGradient}>
        {/* Decorative circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />
      </View>

      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>SpendWise</Text>
          <Text style={styles.appTagline}>Votre partenaire financier intelligent</Text>
        </View>
        
        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Bienvenue ! 👋</Text>
          <Text style={styles.subtitle}>
            Gérez vos dépenses facilement et prenez le contrôle de vos finances personnelles
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, styles.buttonSpacing]}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Créer un compte</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            En continuant, vous acceptez nos conditions d'utilisation
          </Text>
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F5F7FA',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#233675',
    opacity: 0.05,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#4ECDC4',
    opacity: 0.05,
  },
  decorativeCircle3: {
    position: 'absolute',
    top: '30%',
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFD93D',
    opacity: 0.05,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...(Platform.OS === 'web' ? { boxShadow: '0 8px 24px rgba(35,54,117,0.15)' } : {
      shadowColor: '#233675',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    }),
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#233675',
    marginBottom: 8,
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 14,
    color: '#6E6E73',
    fontWeight: '500',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6E6E73',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  buttonSpacing: {
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#233675',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    ...(Platform.OS === 'web' ? { boxShadow: '0 4px 12px rgba(35,54,117,0.3)' } : {
      shadowColor: '#233675',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    }),
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#233675',
    width: '100%',
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#233675',
  },
  footer: {
    width: '100%',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#6E6E73',
    textAlign: 'center',
    lineHeight: 18,
  },
});

