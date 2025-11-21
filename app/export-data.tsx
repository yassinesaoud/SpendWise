/**
 * Export Data Screen - Export expenses and reports
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';

export default function ExportDataScreen() {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);

  const exportOptions = [
    {
      id: 'csv',
      title: 'Exporter en CSV',
      description: 'Format compatible avec Excel',
      icon: 'file-text',
      color: '#2ECC71',
      onPress: async () => {
        setExporting(true);
        // TODO: Generate CSV file
        setTimeout(() => {
          setExporting(false);
          Alert.alert('Succès', 'Fichier CSV exporté avec succès');
        }, 2000);
      },
    },
    {
      id: 'pdf',
      title: 'Exporter en PDF',
      description: 'Rapport complet en PDF',
      icon: 'file',
      color: '#E74C3C',
      onPress: async () => {
        setExporting(true);
        // TODO: Generate PDF file
        setTimeout(() => {
          setExporting(false);
          Alert.alert('Succès', 'Rapport PDF exporté avec succès');
        }, 2000);
      },
    },
    {
      id: 'json',
      title: 'Exporter en JSON',
      description: 'Données brutes en JSON',
      icon: 'code',
      color: '#3498DB',
      onPress: async () => {
        setExporting(true);
        // TODO: Generate JSON file
        setTimeout(() => {
          setExporting(false);
          Alert.alert('Succès', 'Fichier JSON exporté avec succès');
        }, 2000);
      },
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exporter les données</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Feather name="info" size={24} color="#233675" />
          <Text style={styles.infoText}>
            Exportez vos données pour les sauvegarder ou les analyser dans d'autres applications.
          </Text>
        </View>

        {exportOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.exportCard}
            onPress={option.onPress}
            disabled={exporting}
            activeOpacity={0.7}
          >
            <View style={[styles.exportIcon, { backgroundColor: `${option.color}20` }]}>
              <Feather name={option.icon as any} size={24} color={option.color} />
            </View>
            <View style={styles.exportContent}>
              <Text style={styles.exportTitle}>{option.title}</Text>
              <Text style={styles.exportDescription}>{option.description}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#6E6E73" />
          </TouchableOpacity>
        ))}
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
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#6E6E73',
    lineHeight: 20,
  },
  exportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  exportIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  exportContent: {
    flex: 1,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  exportDescription: {
    fontSize: 14,
    color: '#6E6E73',
  },
});

