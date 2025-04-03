import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function GreenhouseDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock data - would come from your backend
  const greenhouse = {
    id: 1,
    name: 'Tomatoes',
    status: 'active',
    size: '1000 sq ft',
    currentTemp: 24,
    minTemp: 20,
    maxTemp: 26,
    humidity: 65,
    crop: {
      name: 'Roma Tomatoes',
      plantedDate: '2024-02-15',
      harvestDate: '2024-05-15',
      growthStage: 'Flowering',
      progress: 65,
    },
    tasks: [
      { id: 1, title: 'Check irrigation system', status: 'pending' },
      { id: 2, title: 'Prune plants', status: 'in-progress' },
      { id: 3, title: 'Apply fertilizer', status: 'completed' },
    ],
    lastUpdated: '2024-03-15 14:30',
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#34495E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Greenhouse Details</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Main Status Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialIcons name="local-florist" size={24} color="#34495E" />
              <Text style={styles.cardTitle}>{greenhouse.name}</Text>
            </View>
            <View style={[styles.statusBadge, 
              { backgroundColor: greenhouse.status === 'active' ? '#34495E' : '#7F8C8D' }
            ]}>
              <Text style={styles.statusText}>
                {greenhouse.status.charAt(0).toUpperCase() + greenhouse.status.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <MaterialIcons name="straighten" size={20} color="#7F8C8D" />
              <Text style={styles.infoText}>Size: {greenhouse.size}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="spa" size={20} color="#7F8C8D" />
              <Text style={styles.infoText}>Crop: {greenhouse.crop.name}</Text>
            </View>
          </View>
        </View>

        {/* Environmental Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialIcons name="thermostat" size={24} color="#34495E" />
              <Text style={styles.cardTitle}>Environment</Text>
            </View>
            <Text style={styles.updateText}>Updated: {greenhouse.lastUpdated}</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.environmentGrid}>
              <View style={styles.environmentItem}>
                <MaterialIcons name="thermostat" size={24} color="#34495E" />
                <Text style={styles.environmentValue}>{greenhouse.currentTemp}°C</Text>
                <Text style={styles.environmentLabel}>Current</Text>
                <Text style={styles.environmentRange}>
                  {greenhouse.minTemp}°C - {greenhouse.maxTemp}°C
                </Text>
              </View>
              <View style={styles.environmentItem}>
                <MaterialIcons name="water-drop" size={24} color="#34495E" />
                <Text style={styles.environmentValue}>{greenhouse.humidity}%</Text>
                <Text style={styles.environmentLabel}>Humidity</Text>
                <Text style={styles.environmentRange}>Target: 60-70%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Crop Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialIcons name="eco" size={24} color="#34495E" />
              <Text style={styles.cardTitle}>Crop Status</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <MaterialIcons name="calendar-today" size={20} color="#7F8C8D" />
              <Text style={styles.infoText}>Planted: {greenhouse.crop.plantedDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="event" size={20} color="#7F8C8D" />
              <Text style={styles.infoText}>Expected Harvest: {greenhouse.crop.harvestDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="trending-up" size={20} color="#7F8C8D" />
              <Text style={styles.infoText}>Stage: {greenhouse.crop.growthStage}</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, { width: `${greenhouse.crop.progress}%` }]} 
                />
              </View>
              <Text style={styles.progressText}>{greenhouse.crop.progress}%</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="add-task" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>New Task</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="warning" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Report Issue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECF0F1',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  cardContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 8,
  },
  updateText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  environmentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  environmentItem: {
    alignItems: 'center',
    flex: 1,
  },
  environmentValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 8,
  },
  environmentLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  environmentRange: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34495E',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#34495E',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34495E',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 