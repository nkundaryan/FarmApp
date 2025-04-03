import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TaskCardProps {
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  onPress: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ title, status, dueDate, onPress }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return '#F1C40F';
      case 'in_progress':
        return '#3498DB';
      case 'completed':
        return '#2ECC71';
      default:
        return '#95A5A6';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return 'schedule';
      case 'in_progress':
        return 'play-circle-outline';
      case 'completed':
        return 'check-circle';
      default:
        return 'help';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name={getStatusIcon()} size={24} color={getStatusColor()} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.footer}>
          <MaterialIcons name="event" size={16} color="#7F8C8D" />
          <Text style={styles.date}>{dueDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 4,
  },
}); 