import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function InventoryScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="inventory" size={32} color="#2ECC71" />
        <Text style={styles.title}>Inventory</Text>
      </View>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 24,
  },
}); 