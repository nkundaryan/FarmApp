import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

interface FinanceItem {
  title: string;
  icon: MaterialIconName;
}

interface FinanceSection {
  title: string;
  items: FinanceItem[];
}

export default function FinanceScreen() {
  const financeSections: FinanceSection[] = [
    {
      title: 'Financial Overview',
      items: [
        { title: 'Income Tracking', icon: 'account-balance' },
        { title: 'Expense Management', icon: 'receipt' },
        { title: 'Profit Analysis', icon: 'trending-up' },
      ],
    },
    {
      title: 'Seasonal Reports',
      items: [
        { title: 'Season Performance', icon: 'calendar-today' },
        { title: 'Target vs Actual', icon: 'assessment' },
        { title: 'Historical Data', icon: 'history' },
      ],
    },
    {
      title: 'Budget Management',
      items: [
        { title: 'Budget Planning', icon: 'account-balance' },
        { title: 'Cost Analysis', icon: 'analytics' },
        { title: 'Forecasting', icon: 'timeline' },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="account-balance" size={32} color="#2ECC71" />
        <Text style={styles.title}>Finance</Text>
      </View>

      {financeSections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity key={itemIndex} style={styles.financeItem}>
              <MaterialIcons name={item.icon} size={24} color="#2ECC71" />
              <Text style={styles.financeTitle}>{item.title}</Text>
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
  financeItem: {
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
  financeTitle: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 12,
  },
}); 