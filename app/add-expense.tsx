/**
 * Add Expense Screen - With image picker for receipts
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert, Platform, KeyboardAvoidingView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { getAllCategories } from '../src/utils/categories';
import { useTheme } from '../src/context/ThemeContext';
import { useCurrency } from '../src/hooks/useCurrency';

const CATEGORIES = getAllCategories();

export default function AddExpenseScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { formatAmount } = useCurrency();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState<any>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [receiptUri, setReceiptUri] = useState<string | null>(null);

  // Auto-categorize based on description
  useEffect(() => {
    if (description || vendor) {
      const text = `${description} ${vendor}`.toLowerCase();
      let suggested = null;
      
      if (text.includes('carrefour') || text.includes('super') || text.includes('grocery')) {
        suggested = CATEGORIES.find(c => c.id === 'groceries');
      } else if (text.includes('restaurant') || text.includes('café') || text.includes('food')) {
        suggested = CATEGORIES.find(c => c.id === 'food');
      } else if (text.includes('essence') || text.includes('station') || text.includes('uber')) {
        suggested = CATEGORIES.find(c => c.id === 'transport');
      } else if (text.includes('facture') || text.includes('steg') || text.includes('bill')) {
        suggested = CATEGORIES.find(c => c.id === 'bills');
      }
      
      if (suggested) setCategory(suggested);
    }
  }, [description, vendor]);

  const requestImagePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin de l\'accès à vos photos pour ajouter un reçu.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestImagePermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      // Save to app's document directory
      const fileName = `receipt_${Date.now()}.jpg`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      try {
        await FileSystem.copyAsync({
          from: imageUri,
          to: fileUri,
        });
        setReceiptUri(fileUri);
      } catch (error) {
        console.error('Error saving image:', error);
        Alert.alert('Erreur', 'Impossible de sauvegarder l\'image');
      }
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestImagePermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      const fileName = `receipt_${Date.now()}.jpg`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      try {
        await FileSystem.copyAsync({
          from: imageUri,
          to: fileUri,
        });
        setReceiptUri(fileUri);
      } catch (error) {
        console.error('Error saving image:', error);
        Alert.alert('Erreur', 'Impossible de sauvegarder l\'image');
      }
    }
  };

  const removeImage = () => {
    if (receiptUri) {
      FileSystem.deleteAsync(receiptUri, { idempotent: true }).catch(console.error);
    }
    setReceiptUri(null);
  };

  const showImageOptions = () => {
    Alert.alert(
      'Ajouter un reçu',
      'Choisissez une option',
      [
        { text: 'Prendre une photo', onPress: takePhoto },
        { text: 'Choisir depuis la galerie', onPress: pickImage },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const handleSave = () => {
    if (!amount || !description) {
      Alert.alert('Erreur', 'Veuillez remplir le montant et la description');
      return;
    }

    const expense = {
      amount: parseFloat(amount),
      description,
      vendor,
      category: category?.id || 'other',
      date,
      receiptUri,
    };

    // TODO: Save to AsyncStorage/API
    console.log('Saving expense:', expense);
    Alert.alert('Succès', 'Dépense ajoutée avec succès', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const styles = createStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajouter une dépense</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveHeaderButton}>
          <Feather name="check" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Amount Card */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Montant</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currency}>{formatAmount(0, false).split(' ')[1] || 'TND'}</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Achat au supermarché"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Vendor */}
          <View style={styles.section}>
            <Text style={styles.label}>Vendeur / Lieu</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Carrefour"
              value={vendor}
              onChangeText={setVendor}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.label}>Catégorie</Text>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              {category ? (
                <View style={styles.categorySelected}>
                  <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                    <Feather name={category.icon as any} size={20} color={category.color} />
                  </View>
                  <Text style={styles.categoryText}>{category.name}</Text>
                </View>
              ) : (
                <Text style={styles.categoryPlaceholder}>Sélectionner une catégorie</Text>
              )}
              <Feather name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {showCategoryPicker && (
              <View style={styles.categoryPickerContainer}>
                <ScrollView 
                  style={styles.categoryPicker}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                >
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryOption,
                        category?.id === cat.id && styles.categoryOptionSelected,
                      ]}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategoryPicker(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.categoryIcon, { backgroundColor: `${cat.color}20` }]}>
                        <Feather name={cat.icon as any} size={20} color={cat.color} />
                      </View>
                      <Text style={styles.categoryOptionText}>{cat.name}</Text>
                      {category?.id === cat.id && (
                        <Feather name="check" size={20} color={cat.color} />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Date */}
          <View style={styles.section}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Receipt Image */}
          <View style={styles.section}>
            <Text style={styles.label}>Reçu</Text>
            {receiptUri ? (
              <View style={styles.receiptContainer}>
                <Image source={{ uri: receiptUri }} style={styles.receiptImage} />
                <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                  <Feather name="x" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addReceiptButton} onPress={showImageOptions}>
                <Feather name="camera" size={24} color={colors.primary} />
                <Text style={styles.addReceiptText}>Ajouter un reçu</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
    backgroundColor: colors.cardBackground,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
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
    color: colors.textPrimary,
  },
  saveHeaderButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  amountCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  amountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currency: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  section: {
    marginBottom: 24,
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
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categorySelected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  categoryPlaceholder: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  categoryPickerContainer: {
    marginTop: 8,
    maxHeight: 300,
  },
  categoryPicker: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 300,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  categoryOptionSelected: {
    backgroundColor: colors.background,
  },
  categoryOptionText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  addReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    gap: 12,
  },
  addReceiptText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  receiptContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#E74C3C',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
