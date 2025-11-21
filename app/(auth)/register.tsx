/**
 * Register Screen - Complete registration with validation, phone, and location picker
 */

import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, Alert, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  age?: string;
  budget?: string;
  location?: string;
  phone?: string;
}

const TUNISIAN_GOVERNORATES = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba',
  'Kairouan', 'Kasserine', 'Kébili', 'Kef', 'Mahdia', 'Manouba', 'Médenine',
  'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine',
  'Tozeur', 'Tunis', 'Zaghouan'
];

export default function RegisterScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [location, setLocation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+216|00216)?[0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email invalide';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer le mot de passe';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (phone && !validatePhone(phone)) {
      newErrors.phone = 'Numéro de téléphone invalide (format: +216 XX XXX XXX ou 0X XXX XXX)';
    }

    if (age && (isNaN(Number(age)) || Number(age) < 13 || Number(age) > 120)) {
      newErrors.age = 'Âge invalide (13-120 ans)';
    }

    if (monthlyBudget && (isNaN(Number(monthlyBudget)) || Number(monthlyBudget) < 0)) {
      newErrors.budget = 'Budget invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validateForm()) {
      // TODO: Save user data
      Alert.alert('Succès', 'Compte créé avec succès !', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    }
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const digits = text.replace(/\D/g, '');
    
    // Format as +216 XX XXX XXX or 0X XXX XXX
    if (digits.startsWith('216')) {
      return `+216 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    } else if (digits.startsWith('0')) {
      return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    } else if (digits.length > 0) {
      return `0${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4)}`;
    }
    return text;
  };

  const styles = createStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Créer un compte</Text>
          
          {/* Personal Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom complet *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Votre nom complet"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholderTextColor={colors.textSecondary}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="votre@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.textSecondary}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Numéro de téléphone</Text>
              <View style={styles.phoneContainer}>
                <Feather name="phone" size={20} color={colors.textSecondary} style={styles.phoneIcon} />
                <TextInput
                  style={[styles.phoneInput, errors.phone && styles.inputError]}
                  placeholder="+216 XX XXX XXX"
                  value={phone}
                  onChangeText={(text) => {
                    const formatted = formatPhoneNumber(text);
                    setPhone(formatted);
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              <Text style={styles.hintText}>Format: +216 XX XXX XXX ou 0X XXX XXX</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Âge</Text>
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                placeholder="Votre âge"
                value={age}
                onChangeText={(text) => {
                  setAge(text);
                  if (errors.age) setErrors({ ...errors, age: undefined });
                }}
                keyboardType="number-pad"
                placeholderTextColor={colors.textSecondary}
              />
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gouvernorat</Text>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={() => setShowLocationPicker(true)}
              >
                {location ? (
                  <Text style={styles.locationText}>{location}</Text>
                ) : (
                  <Text style={styles.locationPlaceholder}>Sélectionner un gouvernorat</Text>
                )}
                <Feather name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sécurité</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe *</Text>
              <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmer le mot de passe *</Text>
              <View style={[styles.passwordContainer, errors.confirmPassword && styles.inputError]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
          </View>

          {/* Budget Setup */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configuration du budget</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Budget mensuel (TND)</Text>
              <TextInput
                style={[styles.input, errors.budget && styles.inputError]}
                placeholder="Ex: 1500"
                value={monthlyBudget}
                onChangeText={(text) => {
                  setMonthlyBudget(text);
                  if (errors.budget) setErrors({ ...errors, budget: undefined });
                }}
                keyboardType="decimal-pad"
                placeholderTextColor={colors.textSecondary}
              />
              {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}
              <Text style={styles.hintText}>Vous pourrez le modifier plus tard</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, (!name || !email || !password || !confirmPassword) && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={!name || !email || !password || !confirmPassword}
          >
            <Text style={styles.registerButtonText}>Créer un compte</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginLinkContainer}>
            <Text style={styles.loginLink}>Déjà un compte ? Se connecter</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Location Picker Modal */}
      <Modal
        visible={showLocationPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner un gouvernorat</Text>
              <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
                <Feather name="x" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView 
              style={styles.locationList}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {TUNISIAN_GOVERNORATES.map((gov) => (
                <TouchableOpacity
                  key={gov}
                  style={[
                    styles.locationOption,
                    location === gov && styles.locationOptionSelected,
                  ]}
                  onPress={() => {
                    setLocation(gov);
                    setShowLocationPicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.locationOptionText,
                    location === gov && styles.locationOptionTextSelected,
                  ]}>
                    {gov}
                  </Text>
                  {location === gov && (
                    <Feather name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 16,
    marginTop: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 32,
    paddingTop: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: '#E74C3C',
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#E74C3C',
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  phoneIcon: {
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  locationPlaceholder: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  eyeIcon: {
    padding: 16,
  },
  registerButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  registerButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loginLinkContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  locationList: {
    maxHeight: 400,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.background,
  },
  locationOptionSelected: {
    backgroundColor: `${colors.primary}20`,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  locationOptionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  locationOptionTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
});
