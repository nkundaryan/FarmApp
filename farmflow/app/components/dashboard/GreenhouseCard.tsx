import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface GreenhouseCardProps {
  name: string;
  size: number;
  onPress: () => void;
}

export const GreenhouseCard: React.FC<GreenhouseCardProps> = ({ name, size, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <MaterialIcons name="local-florist" size={32} color="#2ECC71" />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.size}>{size} sq ft</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 12,
    marginBottom: 4,
  },
  size: {
    fontSize: 14,
    color: '#7F8C8D',
  },
}); 