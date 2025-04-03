import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onViewAll }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onViewAll && (
        <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialIcons name="chevron-right" size={20} color="#2ECC71" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2ECC71',
    marginRight: 4,
  },
}); 