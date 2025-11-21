/**
 * About Screen - App information
 */

import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AboutScreen() {
  const router = useRouter();

  const handleLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>À propos</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Logo/Info */}
        <View style={styles.appInfo}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>SW</Text>
            </View>
          </View>
          <Text style={styles.appName}>SpendWise</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            Gérez vos finances intelligemment et prenez le contrôle de vos dépenses
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fonctionnalités</Text>
          <View style={styles.featuresList}>
            {[
              { icon: 'dollar-sign', text: 'Suivi des dépenses' },
              { icon: 'pie-chart', text: 'Statistiques détaillées' },
              { icon: 'credit-card', text: 'Gestion du budget' },
              { icon: 'bell', text: 'Notifications intelligentes' },
              { icon: 'refresh-cw', text: 'Synchronisation bancaire' },
              { icon: 'file-text', text: 'Gestion des factures' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Feather name={feature.icon as any} size={20} color="#233675" />
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liens utiles</Text>
          <View style={styles.linksCard}>
            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => handleLink('https://spendwise.tn/privacy')}
            >
              <Feather name="shield" size={20} color="#233675" />
              <Text style={styles.linkText}>Politique de confidentialité</Text>
              <Feather name="external-link" size={16} color="#6E6E73" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => handleLink('https://spendwise.tn/terms')}
            >
              <Feather name="file-text" size={20} color="#233675" />
              <Text style={styles.linkText}>Conditions d'utilisation</Text>
              <Feather name="external-link" size={16} color="#6E6E73" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => router.push('/support')}
            >
              <Feather name="help-circle" size={20} color="#233675" />
              <Text style={styles.linkText}>Support</Text>
              <Feather name="chevron-right" size={20} color="#6E6E73" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Credits */}
        <View style={styles.credits}>
          <Text style={styles.creditsText}>Développé avec ❤️ pour la Tunisie</Text>
          <Text style={styles.creditsSubtext}>© 2024 SpendWise. Tous droits réservés.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
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
    color: '#1C1C1E',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  appInfo: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#233675',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#6E6E73',
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    color: '#6E6E73',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  featuresList: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  linksCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  credits: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: 48,
  },
  creditsText: {
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  creditsSubtext: {
    fontSize: 12,
    color: '#6E6E73',
  },
});

