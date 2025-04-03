import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface GreenhouseTileProps {
  name: string;
  size: string;
  temperature: number;
  humidity: number;
  status: 'active' | 'maintenance' | 'inactive';
  onPress: () => void;
}

export const GreenhouseTile: React.FC<GreenhouseTileProps> = ({
  name,
  size,
  temperature,
  humidity,
  status,
  onPress,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return '#34495E';
      case 'maintenance':
        return '#7F8C8D';
      case 'inactive':
        return '#BDC3C7';
      default:
        return '#95A5A6';
    }
  };

  const getStatusBackground = () => {
    switch (status) {
      case 'active':
        return '#E8F6F0';
      case 'maintenance':
        return '#FEF9E7';
      case 'inactive':
        return '#FDEDEC';
      default:
        return '#F5F6FA';
    }
  };

  const getTemperatureColor = () => {
    if (temperature >= 25) return '#E74C3C';
    if (temperature <= 20) return '#3498DB';
    return '#2ECC71';
  };

  const getHumidityColor = () => {
    if (humidity >= 75) return '#3498DB';
    if (humidity <= 60) return '#E74C3C';
    return '#2ECC71';
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: getStatusBackground() }]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <MaterialIcons name="local-florist" size={20} color={getStatusColor()} />
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <MaterialIcons name="straighten" size={16} color="#7F8C8D" />
          <Text style={styles.detailText}>{size}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons 
            name="thermostat" 
            size={16} 
            color="#7F8C8D"
          />
          <Text style={styles.detailText}>
            {temperature}°C
          </Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons 
            name="water-drop" 
            size={16} 
            color="#7F8C8D"
          />
          <Text style={styles.detailText}>
            {humidity}%
          </Text>
        </View>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#ECF0F1',
    height: 160,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 6,
    flex: 1,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#34495E',
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
}); 