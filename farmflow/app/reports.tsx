import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

interface ReportItem {
  title: string;
  icon: MaterialIconName;
}

interface ReportSection {
  title: string;
  items: ReportItem[];
}

export default function ReportsScreen() {
  const reportSections: ReportSection[] = [
    {
      title: 'Weekly Reports',
      items: [
        { title: 'Harvest Report', icon: 'eco' },
        { title: 'Performance Ranking', icon: 'leaderboard' },
        { title: 'Plant Development', icon: 'trending-up' },
      ],
    },
    {
      title: 'Scouting Reports',
      items: [
        { title: 'Pest & Disease', icon: 'bug-report' },
        { title: 'Plant Health', icon: 'health-and-safety' },
        { title: 'Environmental Data', icon: 'thermostat' },
      ],
    },
    {
      title: 'Chemical & Fertilizer',
      items: [
        { title: 'Usage Reports', icon: 'science' },
        { title: 'Application History', icon: 'history' },
        { title: 'Inventory Status', icon: 'inventory' },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="assessment" size={32} color="#2ECC71" />
        <Text style={styles.title}>Reports</Text>
      </View>

      {reportSections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity key={itemIndex} style={styles.reportItem}>
              <MaterialIcons name={item.icon} size={24} color="#2ECC71" />
              <Text style={styles.reportTitle}>{item.title}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#95A5A6" />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 12,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportTitle: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 12,
  },
}); 