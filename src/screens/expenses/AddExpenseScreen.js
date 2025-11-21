/**
 * Add Expense Screen
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../../components/Header';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { ExpensesAPI } from '../../services/api';
import { autoCategorize } from '../../utils/autoCategorize';
import { getAllCategories } from '../../utils/categories';

const AddExpenseScreen = ({ navigation, route }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Auto-categorize when description or vendor changes
  React.useEffect(() => {
    if (description || vendor) {
      const suggestedCategory = autoCategorize(description, vendor);
      setCategory(suggestedCategory);
    }
  }, [description, vendor]);

  const handleSave = async () => {
    if (!amount || !description) {
      Alert.alert('Erreur', 'Veuillez remplir le montant et la description');
      return;
    }

    const expense = {
      amount: parseFloat(amount),
      description,
      vendor: vendor || undefined,
      category: category?.id || 'other',
      date: new Date(date).toISOString(),
    };

    try {
      await ExpensesAPI.create(expense);
      Alert.alert('Succès', 'Dépense ajoutée avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter la dépense');
    }
  };

  const categories = getAllCategories();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Ajouter une dépense"
        onBack={() => navigation.goBack()}
        rightAction={handleSave}
        rightIcon="check"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Montant (TND) *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Achat au supermarché"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Vendeur / Magasin</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Carrefour"
                value={vendor}
                onChangeText={setVendor}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Catégorie</Text>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <View style={styles.categoryButtonContent}>
                  {category ? (
                    <>
                      <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                        <Feather name={category.icon} size={20} color={category.color} />
                      </View>
                      <Text style={styles.categoryText}>{category.name}</Text>
                    </>
                  ) : (
                    <Text style={styles.categoryPlaceholder}>Sélectionner une catégorie</Text>
                  )}
                  <Feather name="chevron-down" size={20} color={Colors.textSecondary} />
                </View>
              </TouchableOpacity>

              {showCategoryPicker && (
                <View style={styles.categoryPicker}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.categoryOption}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <View style={[styles.categoryIcon, { backgroundColor: `${cat.color}20` }]}>
                        <Feather name={cat.icon} size={20} color={cat.color} />
                      </View>
                      <Text style={styles.categoryOptionText}>{cat.name}</Text>
                      {category?.id === cat.id && (
                        <Feather name="check" size={20} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
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
  form: {
    padding: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  categoryText: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textPrimary,
  },
  categoryPlaceholder: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  categoryPicker: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
    maxHeight: 300,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryOptionText: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  saveButtonText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.white,
  },
});

export default AddExpenseScreen;

