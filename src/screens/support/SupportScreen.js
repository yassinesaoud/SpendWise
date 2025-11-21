/**
 * Support Screen
 * Contact and help information
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../../components/Header';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../theme';

const SupportScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!name || !email || !message) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    // TODO: Implement actual support request submission
    Alert.alert('Succès', 'Votre message a été envoyé. Nous vous répondrons bientôt.');
    setName('');
    setEmail('');
    setMessage('');
  };

  const handleCall = () => {
    Linking.openURL('tel:+21612345678');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@spendwise.tn');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Support" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Contact Info */}
          <View style={styles.contactCard}>
            <Text style={styles.sectionTitle}>Nous contacter</Text>
            <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
              <Feather name="mail" size={24} color={Colors.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>support@spendwise.tn</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
              <Feather name="phone" size={24} color={Colors.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Téléphone</Text>
                <Text style={styles.contactValue}>+216 12 345 678</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.contactItem}>
              <Feather name="clock" size={24} color={Colors.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Heures d'ouverture</Text>
                <Text style={styles.contactValue}>Lun - Ven: 9h - 18h</Text>
              </View>
            </View>
          </View>

          {/* Contact Form */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Envoyer un message</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                placeholder="Votre nom"
                value={name}
                onChangeText={setName}
              />
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
                placeholder="Décrivez votre problème ou question..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={5}
              />
            </View>
            <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.8}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  content: {
    flex: 1,
  },
  contactCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    margin: Spacing.xl,
    ...Shadows.small,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  contactInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  contactLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  contactValue: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textPrimary,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  sendButtonText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.white,
  },
  faqCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.small,
  },
  faqItem: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  faqQuestion: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  faqAnswer: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default SupportScreen;

