/**
 * Support Route - Expo Router
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert, Platform, Linking, KeyboardAvoidingView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SupportScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!name || !email || !message) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    Alert.alert('Succès', 'Votre message a été envoyé. Nous vous répondrons bientôt.');
    setName('');
    setEmail('');
    setMessage('');
  };

  const handleCall = () => Linking.openURL('tel:+21612345678');
  const handleEmail = () => Linking.openURL('mailto:support@spendwise.tn');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Contact Info */}
          <View style={styles.contactCard}>
            <Text style={styles.sectionTitle}>Nous contacter</Text>
            <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
              <Feather name="mail" size={24} color="#233675" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>support@spendwise.tn</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#6E6E73" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
              <Feather name="phone" size={24} color="#233675" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Téléphone</Text>
                <Text style={styles.contactValue}>+216 12 345 678</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#6E6E73" />
            </TouchableOpacity>
            <View style={styles.contactItem}>
              <Feather name="clock" size={24} color="#233675" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Heures d'ouverture</Text>
                <Text style={styles.contactValue}>Lun - Ven: 9h - 18h</Text>
              </View>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Envoyer un message</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom</Text>
              <TextInput style={styles.input} placeholder="Votre nom" value={name} onChangeText={setName} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="votre@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Décrivez votre problème..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={5}
              />
            </View>
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Envoyer</Text>
            </TouchableOpacity>
          </View>

          {/* FAQ */}
          <View style={styles.faqCard}>
            <Text style={styles.sectionTitle}>Questions fréquentes</Text>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Comment synchroniser mes comptes bancaires ?</Text>
              <Text style={styles.faqAnswer}>
                Allez dans l'onglet Synchronisation et suivez les instructions pour connecter votre banque.
              </Text>
            </View>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Comment modifier mon budget ?</Text>
              <Text style={styles.faqAnswer}>
                Accédez à l'écran Budget depuis le menu principal et modifiez le montant mensuel.
              </Text>
            </View>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Mes données sont-elles sécurisées ?</Text>
              <Text style={styles.faqAnswer}>
                Oui, toutes vos données sont cryptées et stockées de manière sécurisée.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 12,
    color: '#6E6E73',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#233675',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 32,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  faqItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6E6E73',
    lineHeight: 20,
  },
});

