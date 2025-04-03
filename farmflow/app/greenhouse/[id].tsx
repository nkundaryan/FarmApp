import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Greenhouse {
  id: number;
  name: string;
  size: number;
  status: 'active' | 'maintenance' | 'inactive';
  created_at: string;
  updated_at: string;
}

interface GrowingCycle {
  id: number;
  crop_name: string;
  seed_type: string;
  planting_date: string;
  expected_harvest_date: string;
  actual_harvest_date: string | null;
  status: 'preparing' | 'growing' | 'harvesting' | 'completed' | 'terminated';
  notes: string | null;
}

interface MaintenanceActivity {
  id: number;
  date: string;
  type: 'cleaning' | 'repair';
  schedule: 'planned' | 'unplanned';
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  completion_date: string | null;
  notes: string | null;
}

export default function GreenhouseDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greenhouse, setGreenhouse] = useState<Greenhouse | null>(null);
  const [currentCycle, setCurrentCycle] = useState<GrowingCycle | null>(null);
  const [maintenanceActivities, setMaintenanceActivities] = useState<MaintenanceActivity[]>([]);

  useEffect(() => {
    fetchGreenhouseData();
  }, [id]);

  const fetchGreenhouseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch greenhouse details
      const response = await fetch(`http://localhost:8000/api/greenhouses/${id}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch greenhouse details');
      }
      const data = await response.json();
      setGreenhouse(data);

      // Fetch current growing cycle
      const cyclesResponse = await fetch(`http://localhost:8000/api/greenhouses/${id}/cycles/`);
      if (cyclesResponse.ok) {
        const cyclesData = await cyclesResponse.json();
        const activeCycle = cyclesData.find((cycle: GrowingCycle) => 
          ['preparing', 'growing', 'harvesting'].includes(cycle.status)
        );
        setCurrentCycle(activeCycle || null);
      }

      // Fetch maintenance activities
      const maintenanceResponse = await fetch(`http://localhost:8000/api/greenhouses/${id}/maintenance/`);
      if (maintenanceResponse.ok) {
        const maintenanceData = await maintenanceResponse.json();
        setMaintenanceActivities(maintenanceData);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching greenhouse data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    console.log('Deleting greenhouse:', id);
    try {
      const response = await fetch(`http://localhost:8000/api/greenhouses/${id}/`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        console.log('Delete successful');
        router.replace('/greenhouses');
      } else {
        console.error('Delete failed:', response.status);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#34495E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34495E" />
        </View>
      </View>
    );
  }

  if (error || !greenhouse) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#34495E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Greenhouse not found'}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchGreenhouseData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
            <View style={styles.cardActions}>
              <View style={[styles.statusBadge, 
                { backgroundColor: greenhouse.status === 'active' ? '#4CAF50' : 
                                 greenhouse.status === 'maintenance' ? '#FFA726' : '#FF5252' }
              ]}>
                <Text style={styles.statusText}>
                  {greenhouse.status.charAt(0).toUpperCase() + greenhouse.status.slice(1)}
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.deleteButton, { backgroundColor: '#FFE5E5' }]}
                onPress={handleDelete}
              >
                <MaterialIcons name="delete" size={24} color="#E74C3C" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <MaterialIcons name="straighten" size={20} color="#7F8C8D" />
              <Text style={styles.infoText}>Size: {greenhouse.size} sq ft</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="update" size={20} color="#7F8C8D" />
              <Text style={styles.infoText}>
                Last Updated: {new Date(greenhouse.updated_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Current Growing Cycle Card */}
        {currentCycle && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <MaterialIcons name="eco" size={24} color="#34495E" />
                <Text style={styles.cardTitle}>Current Crop</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <MaterialIcons name="spa" size={20} color="#7F8C8D" />
                <Text style={styles.infoText}>Crop: {currentCycle.crop_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="grass" size={20} color="#7F8C8D" />
                <Text style={styles.infoText}>Seed Type: {currentCycle.seed_type}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="event" size={20} color="#7F8C8D" />
                <Text style={styles.infoText}>
                  Planted: {new Date(currentCycle.planting_date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="event-available" size={20} color="#7F8C8D" />
                <Text style={styles.infoText}>
                  Expected Harvest: {new Date(currentCycle.expected_harvest_date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <MaterialIcons 
                  name={currentCycle.status === 'growing' ? 'trending-up' : 
                        currentCycle.status === 'harvesting' ? 'agriculture' : 'hourglass-empty'} 
                  size={20} 
                  color="#4CAF50" 
                />
                <Text style={[styles.statusText, { color: '#4CAF50' }]}>
                  {currentCycle.status.charAt(0).toUpperCase() + currentCycle.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Maintenance Activities Card */}
        {maintenanceActivities.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <MaterialIcons name="build" size={24} color="#34495E" />
                <Text style={styles.cardTitle}>Maintenance Activities</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              {maintenanceActivities.slice(0, 3).map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityTitle}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </Text>
                    <View style={[styles.activityStatus, {
                      backgroundColor: activity.status === 'completed' ? '#4CAF50' :
                                     activity.status === 'in_progress' ? '#FFA726' : '#FF5252'
                    }]}>
                      <Text style={styles.activityStatusText}>
                        {activity.status.replace('_', ' ').charAt(0).toUpperCase() + 
                         activity.status.slice(1).replace('_', ' ')}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <View style={styles.activityFooter}>
                    <MaterialIcons name="event" size={16} color="#7F8C8D" />
                    <Text style={styles.activityDate}>
                      {new Date(activity.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push(`/greenhouse/${id}/maintenance/new`)}
          >
            <MaterialIcons name="build" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>New Maintenance</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push(`/greenhouse/${id}/cycle/new`)}
          >
            <MaterialIcons name="eco" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>New Growing Cycle</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#34495E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
    textAlign: 'center',
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
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  activityItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  activityStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  activityDescription: {
    fontSize: 14,
    color: '#34495E',
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#7F8C8D',
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