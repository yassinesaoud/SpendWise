/**
 * Export Data Screen - Export financial data to CSV, PDF, JSON
 */

import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '../src/context/ThemeContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ExportDataScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [exporting, setExporting] = useState<string | null>(null);

  const generateCSV = () => {
    // Sample data structure
    const headers = ['Date', 'Description', 'Montant', 'Catégorie', 'Vendeur'];
    const rows = [
      ['2024-01-15', 'Courses Carrefour', '125.50', 'Groceries', 'Carrefour'],
      ['2024-01-14', 'Essence', '80.00', 'Transport', 'Station Total'],
      ['2024-01-13', 'Restaurant', '45.00', 'Food', 'Le Gourmet'],
    ];
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  };

  const generateJSON = () => {
    const data = {
      expenses: [
        { id: '1', date: '2024-01-15', description: 'Courses Carrefour', amount: 125.50, category: 'Groceries', vendor: 'Carrefour' },
        { id: '2', date: '2024-01-14', description: 'Essence', amount: 80.00, category: 'Transport', vendor: 'Station Total' },
        { id: '3', date: '2024-01-13', description: 'Restaurant', amount: 45.00, category: 'Food', vendor: 'Le Gourmet' },
      ],
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(data, null, 2);
  };

  const handleExport = async (format: 'CSV' | 'PDF' | 'JSON') => {
    try {
      setExporting(format);
      
      let content: string;
      let fileName: string;
      let mimeType: string;

      if (format === 'CSV') {
        content = generateCSV();
        fileName = `spendwise_export_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else if (format === 'JSON') {
        content = generateJSON();
        fileName = `spendwise_export_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else {
        // PDF would require a library like react-native-pdf or similar
        Alert.alert('Info', 'L\'export PDF nécessite une bibliothèque supplémentaire. Fonctionnalité à venir.');
        setExporting(null);
        return;
      }

      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType,
          dialogTitle: `Exporter les données en ${format}`,
        });
        Alert.alert('Succès', `Données exportées en ${format} avec succès !`);
      } else {
        Alert.alert('Info', `Fichier sauvegardé: ${fileName}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'export');
    } finally {
      setExporting(null);
    }
  };

  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exporter les données</Text>
        <View style={{ width: 24, height: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Feather name="info" size={24} color={colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Exportez vos données financières pour les analyser ou les sauvegarder.
            Choisissez le format d'exportation ci-dessous.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => handleExport('CSV')}
          disabled={exporting !== null}
        >
          {exporting === 'CSV' ? (
            <ActivityIndicator color="#2ECC71" />
          ) : (
            <Feather name="file-text" size={24} color="#2ECC71" />
          )}
          <View style={styles.exportButtonContent}>
            <Text style={styles.exportButtonText}>Exporter en CSV</Text>
            <Text style={styles.exportButtonSubtext}>Compatible avec Excel, Google Sheets</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => handleExport('PDF')}
          disabled={exporting !== null}
        >
          {exporting === 'PDF' ? (
            <ActivityIndicator color="#E74C3C" />
          ) : (
            <Feather name="file-text" size={24} color="#E74C3C" />
          )}
          <View style={styles.exportButtonContent}>
            <Text style={styles.exportButtonText}>Exporter en PDF</Text>
            <Text style={styles.exportButtonSubtext}>Format document professionnel</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => handleExport('JSON')}
          disabled={exporting !== null}
        >
          {exporting === 'JSON' ? (
            <ActivityIndicator color="#3498DB" />
          ) : (
            <Feather name="code" size={24} color="#3498DB" />
          )}
          <View style={styles.exportButtonContent}>
            <Text style={styles.exportButtonText}>Exporter en JSON</Text>
            <Text style={styles.exportButtonSubtext}>Format de données structuré</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.noteCard}>
          <Feather name="alert-circle" size={20} color={colors.textSecondary} />
          <Text style={styles.noteText}>
            Les données exportées incluent toutes vos dépenses, catégories et informations de transaction.
          </Text>
        </View>
      </View>
    </SafeAreaView>
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingBottom: 16,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${colors.primary}20`,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 16,
    ...(Platform.OS === 'web' ? { boxShadow: `0 2px 8px ${colors.shadow}` } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  exportButtonContent: {
    flex: 1,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  exportButtonSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
