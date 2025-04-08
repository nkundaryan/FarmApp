import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateGreenhouseStatus } from '../store/slices/greenhouseSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Divider } from 'react-native-paper';

type Status = 'active' | 'maintenance' | 'inactive';

interface UsageInventoryItem {
  id: number;
  name: string;
  unit: string;
}

interface InventoryUsageRecord {
  id: number;
  inventory_item: UsageInventoryItem;
  quantity_used: string;
  purpose_note: string;
  usage_date: string;
}

interface Greenhouse {
  id: number;
  name: string;
  size: string;
  status: Status;
  created_at: string;
  updated_at: string;
  currentCrop?: {
    type: string;
    variety: string;
    plantingDate: string;
    expectedHarvestDate: string;
    areaUsed: string;
  };
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

interface CropDetails {
  crop_name: string;
  seed_type: string;
  planting_date: Date;
  expected_harvest_date: Date;
  area_used: string;
}

export default function GreenhouseDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greenhouse, setGreenhouse] = useState<Greenhouse | null>(null);
  const [currentCycle, setCurrentCycle] = useState<GrowingCycle | null>(null);
  const [maintenanceActivities, setMaintenanceActivities] = useState<MaintenanceActivity[]>([]);
  const [cropDetails, setCropDetails] = useState<CropDetails>({
    crop_name: '',
    seed_type: '',
    planting_date: new Date(),
    expected_harvest_date: new Date(),
    area_used: '',
  });
  const [showPlantingDatePicker, setShowPlantingDatePicker] = useState(false);
  const [showHarvestDatePicker, setShowHarvestDatePicker] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [inventoryUsage, setInventoryUsage] = useState<InventoryUsageRecord[]>([]);

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

      // Fetch Inventory Usage History for this greenhouse
      const usageResponse = await fetch(`http://localhost:8000/api/inventory-usage/?greenhouse_id=${id}`);
      if (usageResponse.ok) {
        const usageData = await usageResponse.json();
        setInventoryUsage(usageData);
      } else {
        console.warn('Could not fetch inventory usage history for this greenhouse.');
        setInventoryUsage([]);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching greenhouse data:', err);
      setGreenhouse(null);
      setCurrentCycle(null);
      setMaintenanceActivities([]);
      setInventoryUsage([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    console.log("[handleDelete] Function called.");
    if (!greenhouse) {
        console.log("[handleDelete] No greenhouse data found, exiting.");
        return;
    }
    console.log(`[handleDelete] Attempting to delete greenhouse with id: ${id}`);
    
    try {
      console.log(`[handleDelete] Sending DELETE request to: http://localhost:8000/api/greenhouses/${id}/`);
      const response = await fetch(`http://localhost:8000/api/greenhouses/${id}/`, {
        method: 'DELETE'
      });
      
      console.log(`[handleDelete] Response status: ${response.status}`);
      if (response.ok) {
        console.log('[handleDelete] Delete successful via API.');
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/greenhouses'); 
        }
      } else {
        console.error('[handleDelete] Delete failed via API:', response.status);
        Alert.alert('Delete Failed', 'Could not delete the greenhouse. Please try again.'); 
      }
    } catch (err) {
      console.error('[handleDelete] Error during fetch:', err);
      Alert.alert('Delete Error', 'An unexpected error occurred during deletion.');
    }
  };

  const handleStatusChange = async (newStatus: Status) => {
    if (!greenhouse) return;

    try {
      const response = await fetch(`http://localhost:8000/api/greenhouses/${greenhouse.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedGreenhouse = await response.json();
      setGreenhouse(updatedGreenhouse);
      setShowStatusModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!greenhouse) return;

    try {
      // Format the data to match backend expectations
      const formattedData = {
        crop_name: cropDetails.crop_name,
        seed_type: cropDetails.seed_type,
        planting_date: cropDetails.planting_date.toISOString().split('T')[0],
        expected_harvest_date: cropDetails.expected_harvest_date.toISOString().split('T')[0],
        area_used: parseFloat(cropDetails.area_used)
      };

      // Start planting with crop details
      const plantingResponse = await fetch(`http://127.0.0.1:8000/api/greenhouses/${greenhouse.id}/plant/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!plantingResponse.ok) {
        const errorData = await plantingResponse.json();
        throw new Error(errorData.error || 'Failed to start planting');
      }

      const updatedGreenhouse = await plantingResponse.json();
      setGreenhouse(updatedGreenhouse);
      Alert.alert('Success', 'Planting started successfully');
      
      // Refresh the greenhouse data to show the new status and crop
    } catch (error) {
      console.error('Error starting planting:', error);
      Alert.alert('Error', 'Failed to start planting. Please try again.');
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
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#507D2A" />
        </TouchableOpacity>
        <Text style={styles.title}>{greenhouse.name}</Text>
        <View style={styles.headerActions}> 
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}> 
            <MaterialIcons name="delete-outline" size={24} color="#E74C3C" /> 
          </TouchableOpacity>
          <View style={styles.statusContainer}> 
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(greenhouse.status) }]}>
              <Text style={styles.statusText}>{greenhouse.status.charAt(0).toUpperCase() + greenhouse.status.slice(1)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Greenhouse Info */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Greenhouse Information</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="straighten" size={20} color="#666" />
          <Text style={styles.infoText}>Size: {greenhouse.size} sq ft</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="update" size={20} color="#7F8C8D" />
          <Text style={styles.infoText}>
            Last Updated: {new Date(greenhouse.updated_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Crop Form or Summary based on status */}
      {greenhouse.status === 'inactive' ? (
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Plant New Crop</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Crop Type</Text>
            <TextInput
              style={styles.input}
              value={cropDetails.crop_name}
              onChangeText={(text: string) => setCropDetails({ ...cropDetails, crop_name: text })}
              placeholder="e.g., Tomatoes, Lettuce"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Seed Variety</Text>
            <TextInput
              style={styles.input}
              value={cropDetails.seed_type}
              onChangeText={(text: string) => setCropDetails({ ...cropDetails, seed_type: text })}
              placeholder="e.g., Beefsteak, Romaine"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Planting Date</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowPlantingDatePicker(true)}
            >
              <Text>{cropDetails.planting_date.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expected Harvest Date</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowHarvestDatePicker(true)}
            >
              <Text>{cropDetails.expected_harvest_date.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Area to be Used (sq ft)</Text>
            <TextInput
              style={styles.input}
              value={cropDetails.area_used}
              onChangeText={(text: string) => setCropDetails({ ...cropDetails, area_used: text })}
              keyboardType="numeric"
              placeholder="Enter area"
            />
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Start Planting</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Current Crop</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <MaterialIcons name="local-florist" size={20} color="#507D2A" />
              <Text style={styles.summaryText}>Crop: {greenhouse.currentCrop?.type}</Text>
            </View>
            <View style={styles.summaryRow}>
              <MaterialIcons name="grass" size={20} color="#507D2A" />
              <Text style={styles.summaryText}>Variety: {greenhouse.currentCrop?.variety}</Text>
            </View>
            <View style={styles.summaryRow}>
              <MaterialIcons name="event" size={20} color="#507D2A" />
              <Text style={styles.summaryText}>Planted: {new Date(greenhouse.currentCrop?.plantingDate || '').toLocaleDateString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <MaterialIcons name="event-available" size={20} color="#507D2A" />
              <Text style={styles.summaryText}>Harvest: {new Date(greenhouse.currentCrop?.expectedHarvestDate || '').toLocaleDateString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <MaterialIcons name="straighten" size={20} color="#507D2A" />
              <Text style={styles.summaryText}>Area Used: {greenhouse.currentCrop?.areaUsed} sq ft</Text>
            </View>
          </View>
        </View>
      )}

      {/* Inventory Usage History Section (Conditionally Rendered) */}
      {greenhouse && greenhouse.status === 'active' && (
        <View style={styles.usageSection}>
          <Text style={styles.sectionTitle}>Inventory Usage History</Text>
          {inventoryUsage.length === 0 ? (
            <Text style={styles.noUsageText}>No inventory usage recorded for this greenhouse yet.</Text>
          ) : (
            inventoryUsage.map((usage, index) => (
              <View key={usage.id} style={styles.usageItem}>
                <View style={styles.usageHeader}>
                  <Text style={styles.usageItemName}>{usage.inventory_item.name}</Text>
                  <Text style={styles.usageDate}>
                    {new Date(usage.usage_date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.usageDetails}>
                  Used: {usage.quantity_used} {usage.inventory_item.unit}
                </Text>
                <Text style={styles.usagePurpose}>Purpose: {usage.purpose_note}</Text>
                {index < inventoryUsage.length - 1 && <Divider style={styles.usageDivider} />} 
              </View>
            ))
          )}
        </View>
      )}

      {/* Date Pickers */}
      {showPlantingDatePicker && (
        <DateTimePicker
          value={cropDetails.planting_date}
          mode="date"
          onChange={(event, date) => {
            setShowPlantingDatePicker(false);
            if (date) {
              setCropDetails({ ...cropDetails, planting_date: date });
            }
          }}
        />
      )}

      {showHarvestDatePicker && (
        <DateTimePicker
          value={cropDetails.expected_harvest_date}
          mode="date"
          onChange={(event, date) => {
            setShowHarvestDatePicker(false);
            if (date) {
              setCropDetails({ ...cropDetails, expected_harvest_date: date });
            }
          }}
        />
      )}
    </ScrollView>
  );
}

const getStatusColor = (status: Status) => {
  switch (status) {
    case 'active':
      return '#4CAF50';
    case 'maintenance':
      return '#FFA726';
    case 'inactive':
      return '#FF5252';
    default:
      return '#757575';
  }
};

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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
    textAlign: 'center',
  },
  statusContainer: {
    marginLeft: 8,
  },
  infoSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  formSection: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
  },
  submitButton: {
    backgroundColor: '#507D2A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  summarySection: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 8,
  },
  usageSection: {
    padding: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  noUsageText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    paddingVertical: 16,
    fontStyle: 'italic',
  },
  usageItem: {
    marginBottom: 12,
    paddingBottom: 12,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  usageItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
  },
  usageDate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  usageDetails: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 4,
  },
  usagePurpose: {
    fontSize: 14,
    color: '#555',
  },
  usageDivider: {
     marginTop: 12, 
  },
}); 