import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface StatsCardProps {
  value: number;
  label: string;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ value, label, color }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[`${color}40`, `${color}20`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 8,
  },
  gradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
}); 