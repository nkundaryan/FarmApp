import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateGreenhouseStatus } from '../store/slices/greenhouseSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Divider, Checkbox, DataTable, ProgressBar, Button } from 'react-native-paper';

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
  size: number;
  status: Status;
  created_at: string;
  updated_at: string;
  currentCrop?: {
    type: string;
    variety: string;
    plantingDate: string;
    expectedHarvestDate: string;
    areaUsed: string;
    stage: number;
    totalStages: number;
    stageName: string;
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

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

interface InputRecord {
  date: string;
  quantity: string;
  units: string;
  notes: string;
}

interface CurrentCrop {
  type: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  areaUsed: string;
  stage: number;
  totalStages: number;
  stageName: string;
}

interface PlantingForm {
  crop_name: string;
  seed_type: string;
  planting_date: Date;
  harvest_date: Date;
  area_used: string;
}

export default function GreenhouseDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greenhouse, setGreenhouse] = useState<Greenhouse>({
    id: typeof id === 'string' ? parseInt(id, 10) : Array.isArray(id) ? parseInt(id[0], 10) : 0,
    name: `GH${id}`,
    size: 0,
    status: 'inactive',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    currentCrop: {
      type: 'Strawberries',
      variety: 'Unknown',
      plantingDate: new Date().toISOString(),
      expectedHarvestDate: new Date().toISOString(),
      areaUsed: '0',
      stage: 3,
      totalStages: 5,
      stageName: 'Flowering'
    }
  });
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

  // Sample data - replace with actual API calls
  const [tasks] = useState<Task[]>([
    { id: 1, name: 'Prune', completed: false },
    { id: 2, name: 'Water', completed: false },
    { id: 3, name: 'Apply Nutrients', completed: false },
  ]);

  const [inputRecords] = useState<InputRecord[]>([
    { date: '03/10/2024', quantity: '100g', units: 'kg', notes: '—' },
    { date: '02/28/2024', quantity: '80g', units: 'kg', notes: '—' },
  ]);

  const [stage] = useState({
    current: 3,
    total: 5,
    name: 'Flowering'
  });

  const [lastInput] = useState('04/15/2024');

  const [showPlantingDate, setShowPlantingDate] = useState(false);
  const [showHarvestDate, setShowHarvestDate] = useState(false);
  const [plantingForm, setPlantingForm] = useState<PlantingForm>({
    crop_name: '',
    seed_type: '',
    planting_date: new Date(),
    harvest_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    area_used: ''
  });

  useEffect(() => {
    fetchGreenhouseData();
  }, [id]);

  const fetchGreenhouseData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching data for greenhouse ID: ${id}`);

      // Fetch greenhouse details
      const response = await fetch(`http://localhost:8000/api/greenhouses/${id}/`);
      if (!response.ok) {
        console.error('Failed to fetch greenhouse details. Status:', response.status);
        throw new Error('Failed to fetch greenhouse details');
      }
      const data = await response.json();
      
      // Log the backend response for debugging
      console.log('Greenhouse details API response:', data);
      
      // Update greenhouse state with the response data
      const updatedGreenhouse = {
        id: data.id,
        name: data.name,
        size: data.size,
        status: data.status,
        created_at: data.created_at,
        updated_at: data.updated_at,
        currentCrop: data.current_cycle ? {
          type: data.current_cycle.type || '',
          variety: data.current_cycle.variety || '',
          plantingDate: data.current_cycle.plantingDate || new Date().toISOString(),
          expectedHarvestDate: data.current_cycle.expectedHarvestDate || new Date().toISOString(),
          stage: data.current_cycle.stage || 1,
          totalStages: data.current_cycle.totalStages || 5,
          stageName: data.current_cycle.stageName || getStageName(data.current_cycle.stage || 1),
          areaUsed: '0' // Default value since it's not in the backend data
        } : undefined
      };

      console.log('Processed greenhouse state:', updatedGreenhouse);
      
      // If greenhouse is active but has no current crop, update status in backend
      if (updatedGreenhouse.status === 'active' && !updatedGreenhouse.currentCrop) {
        console.log('Greenhouse is active but has no current crop. Updating status in backend.');
        try {
          const statusResponse = await fetch(`http://localhost:8000/api/greenhouses/${id}/status/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'inactive' }),
          });

          if (!statusResponse.ok) {
            console.error('Failed to update greenhouse status:', statusResponse.status);
          } else {
            const updatedStatusData = await statusResponse.json();
            console.log('Status updated in backend:', updatedStatusData);
            updatedGreenhouse.status = 'inactive';
          }
        } catch (err) {
          console.error('Error updating greenhouse status:', err);
        }
      }
      
      setGreenhouse(updatedGreenhouse);

      // Fetch maintenance activities
      const maintenanceResponse = await fetch(`http://localhost:8000/api/greenhouses/${id}/maintenance/`);
      if (maintenanceResponse.ok) {
        const maintenanceData = await maintenanceResponse.json();
        console.log('Maintenance activities:', maintenanceData);
        setMaintenanceActivities(maintenanceData);
      } else {
        console.warn('Failed to fetch maintenance activities. Status:', maintenanceResponse.status);
      }

      // Fetch Inventory Usage History for this greenhouse
      const usageResponse = await fetch(`http://localhost:8000/api/inventory-usage/?greenhouse_id=${id}`);
      if (usageResponse.ok) {
        const usageData = await usageResponse.json();
        console.log('Inventory usage history:', usageData);
        setInventoryUsage(usageData);
      } else {
        console.warn('Could not fetch inventory usage history. Status:', usageResponse.status);
        setInventoryUsage([]);
      }

    } catch (err) {
      console.error('Detailed error in fetchGreenhouseData:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
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

  const handleStartPlanting = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:8000/api/greenhouses/${id}/start_planting/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crop_name: plantingForm.crop_name,
          seed_type: plantingForm.seed_type,
          planting_date: plantingForm.planting_date.toISOString().split('T')[0],
          expected_harvest_date: plantingForm.harvest_date.toISOString().split('T')[0]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start planting');
      }

      const updatedData = await response.json();
      console.log('Received updated data:', updatedData);
      
      // Update local state with the server response
      const updatedGreenhouse: Greenhouse = {
        ...greenhouse,
        status: 'active' as Status,
        currentCrop: updatedData.current_cycle ? {
          type: updatedData.current_cycle.crop_name,
          variety: updatedData.current_cycle.seed_type,
          plantingDate: updatedData.current_cycle.planting_date,
          expectedHarvestDate: updatedData.current_cycle.expected_harvest_date,
          areaUsed: '0',
          stage: 1,
          totalStages: 5,
          stageName: 'Germination'
        } : undefined
      };
      
      console.log('Updating greenhouse state with:', updatedGreenhouse);
      setGreenhouse(updatedGreenhouse);
      
      // Show success message
      Alert.alert('Success', 'Planting started successfully!');
      
    } catch (error: any) {
      console.error('Failed to start planting:', error);
      Alert.alert('Error', error.message || 'Failed to start planting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (newStage: number) => {
    try {
      setLoading(true);
      console.log('Current greenhouse state before update:', greenhouse);
      console.log('Current stage before update:', greenhouse.currentCrop?.stage);
      console.log('Attempting to update to stage:', newStage);
      
      // Check if there's an active cycle
      if (!greenhouse.currentCrop) {
        console.error('No current crop found in greenhouse state. Greenhouse data:', greenhouse);
        // Show the planting form
        setGreenhouse(prev => ({ ...prev, status: 'inactive' }));
        throw new Error('No active growing cycle found. Please start a new planting cycle first.');
      }
      
      // Ensure newStage is a number
      const stageNumber = Number(newStage);
      if (isNaN(stageNumber)) {
        throw new Error('Invalid stage number');
      }
      
      // Validate stage range
      if (stageNumber < 1 || stageNumber > 5) {
        throw new Error('Stage must be between 1 and 5');
      }
      
      const requestData = {
        stage: stageNumber
      };
      
      console.log('Sending stage update request to:', `http://localhost:8000/api/greenhouses/${id}/update_stage/`);
      console.log('Request data:', requestData);
      
      const response = await fetch(`http://localhost:8000/api/greenhouses/${id}/update_stage/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        throw new Error(errorData.error || 'Failed to update stage');
      }

      const updatedData = await response.json();
      console.log('Updated data received from server:', updatedData);
      
      // Update the greenhouse state with the new data
      const updatedState = {
        ...greenhouse,
        currentCrop: {
          ...(greenhouse.currentCrop || {}),
          stage: stageNumber,
          stageName: getStageName(stageNumber),
          type: greenhouse.currentCrop?.type || '',
          variety: greenhouse.currentCrop?.variety || '',
          plantingDate: greenhouse.currentCrop?.plantingDate || new Date().toISOString(),
          expectedHarvestDate: greenhouse.currentCrop?.expectedHarvestDate || new Date().toISOString(),
          areaUsed: greenhouse.currentCrop?.areaUsed || '0',
          totalStages: 5
        }
      };
      
      console.log('New greenhouse state after update:', updatedState);
      setGreenhouse(updatedState);
      
    } catch (error: any) {
      console.error('Detailed error in handleStageChange:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update stage. Please try again.',
        [
          {
            text: 'Start New Planting',
            onPress: () => {
              console.log('User chose to start new planting');
              setGreenhouse(prev => ({ ...prev, status: 'inactive' }));
            },
            style: 'default'
          },
          {
            text: 'OK',
            style: 'cancel'
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const getStageName = (stage: number): string => {
    const stages = [
      'Germination',
      'Seedling',
      'Vegetative Growth',
      'Flowering',
      'Maturation'
    ];
    return stages[stage - 1] || 'Unknown Stage';
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

  const renderHeader = () => (
    <>
      {/* Back to Dashboard */}
      <TouchableOpacity 
        style={styles.backLink}
        onPress={() => router.push('/greenhouses')}
      >
        <MaterialIcons name="arrow-back" size={24} color="#2C3E50" />
        <Text style={styles.backLinkText}>Greenhouses</Text>
      </TouchableOpacity>

      {/* Greenhouse ID, Crop, and Status */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text style={styles.greenhouseId}>{greenhouse.name}</Text>
          {greenhouse.status === 'active' && greenhouse.currentCrop?.type && (
            <Text style={{ marginLeft: 16, fontSize: 18, color: '#4CAF50', fontWeight: '600' }}>
              {greenhouse.currentCrop.type}
              {greenhouse.currentCrop.variety ? ` (${greenhouse.currentCrop.variety})` : ''}
            </Text>
          )}
        </View>
        <View style={styles.headerActions}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(greenhouse.status) }]}> 
            <Text style={styles.statusText}>
              {greenhouse.status.charAt(0).toUpperCase() + greenhouse.status.slice(1)}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={24} color="#E74C3C" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderPlantingForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Start New Planting</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Crop Type</Text>
        <TextInput
          style={styles.input}
          value={plantingForm.crop_name}
          onChangeText={(text) => setPlantingForm(prev => ({ ...prev, crop_name: text }))}
          placeholder="e.g., Tomatoes, Lettuce"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Seed Variety</Text>
        <TextInput
          style={styles.input}
          value={plantingForm.seed_type}
          onChangeText={(text) => setPlantingForm(prev => ({ ...prev, seed_type: text }))}
          placeholder="e.g., Beefsteak, Romaine"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Planting Date</Text>
        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => setShowPlantingDate(true)}
        >
          <Text>{plantingForm.planting_date.toLocaleDateString()}</Text>
          <MaterialIcons name="calendar-today" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Expected Harvest Date</Text>
        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => setShowHarvestDate(true)}
        >
          <Text>{plantingForm.harvest_date.toLocaleDateString()}</Text>
          <MaterialIcons name="calendar-today" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <Button 
        mode="contained" 
        onPress={handleStartPlanting}
        loading={loading}
        disabled={loading || !plantingForm.crop_name || !plantingForm.seed_type}
        style={styles.submitButton}
      >
        Start Planting
      </Button>
    </View>
  );

  const renderMonitoringContent = () => (
    <>
      {/* Stage Progress */}
      <View style={styles.stageContainer}>
        <View style={styles.stageLeft}>
          <TouchableOpacity 
            style={styles.stageButton}
            onPress={() => {
              const currentStage = greenhouse.currentCrop?.stage || 1;
              if (currentStage > 1) {
                handleStageChange(currentStage - 1);
              }
            }}
            disabled={loading || (greenhouse.currentCrop?.stage || 1) <= 1}
          >
            <MaterialIcons 
              name="arrow-back" 
              size={24} 
              color={(greenhouse.currentCrop?.stage || 1) <= 1 ? '#CCCCCC' : '#507D2A'} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.stageCenter}>
          <ProgressBar 
            progress={(greenhouse.currentCrop?.stage || 0) / 5} 
            color="#507D2A"
            style={styles.progressBar}
          />
          <View style={styles.stageTextContainer}>
            <Text style={styles.stageText}>Stage {greenhouse.currentCrop?.stage || 1} of 5</Text>
            <Text style={styles.stageName}>{getStageName(greenhouse.currentCrop?.stage || 1)}</Text>
          </View>
        </View>

        <View style={styles.stageRight}>
          <TouchableOpacity 
            style={styles.stageButton}
            onPress={() => {
              const currentStage = greenhouse.currentCrop?.stage || 1;
              if (currentStage < 5) {
                handleStageChange(currentStage + 1);
              }
            }}
            disabled={loading || (greenhouse.currentCrop?.stage || 1) >= 5}
          >
            <MaterialIcons 
              name="arrow-forward" 
              size={24} 
              color={(greenhouse.currentCrop?.stage || 1) >= 5 ? '#CCCCCC' : '#507D2A'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Last Input Used */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>Last Input Used</Text>
          <Text style={styles.sectionValue}>{lastInput}</Text>
        </View>
      </View>

      {/* Task List and Issue Log Side by Side */}
      <View style={styles.horizontalSection}>
        {/* Task List Box */}
        <View style={styles.boxContainer}>
          <Text style={styles.sectionTitle}>Task List</Text>
          <View style={styles.taskList}>
            {tasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <Checkbox.Android
                  status={task.completed ? 'checked' : 'unchecked'}
                  onPress={() => {}}
                  color="#507D2A"
                />
                <Text style={styles.taskText}>{task.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Issue Log Box */}
        <View style={styles.boxContainer}>
          <Text style={styles.sectionTitle}>Issue Log</Text>
          <View style={styles.issueList}>
            {/* Add issue log content here */}
          </View>
        </View>
      </View>

      {/* Input History Table */}
      <DataTable style={styles.table}>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Quantity</DataTable.Title>
          <DataTable.Title>Units</DataTable.Title>
          <DataTable.Title>Notes</DataTable.Title>
        </DataTable.Header>

        {inputRecords.map((record, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{record.date}</DataTable.Cell>
            <DataTable.Cell>{record.quantity}</DataTable.Cell>
            <DataTable.Cell>{record.units}</DataTable.Cell>
            <DataTable.Cell>{record.notes}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </>
  );

  const renderInactiveMessage = () => (
    <View style={styles.inactiveMessage}>
      <MaterialIcons name="info" size={24} color="#666666" />
      <Text style={styles.inactiveText}>
        This greenhouse is currently {greenhouse.status}. 
        Activate it to start monitoring crops.
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      {greenhouse.status === 'active' ? renderMonitoringContent() : renderPlantingForm()}

      {/* Date Pickers */}
      {showPlantingDate && (
        <DateTimePicker
          value={plantingForm.planting_date}
          mode="date"
          onChange={(event, date) => {
            setShowPlantingDate(false);
            if (date) {
              setPlantingForm(prev => ({ ...prev, planting_date: date }));
            }
          }}
        />
      )}

      {showHarvestDate && (
        <DateTimePicker
          value={plantingForm.harvest_date}
          mode="date"
          onChange={(event, date) => {
            setShowHarvestDate(false);
            if (date) {
              setPlantingForm(prev => ({ ...prev, harvest_date: date }));
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
    padding: 20,
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
    marginBottom: 20,
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
    paddingVertical: 6,
    borderRadius: 16,
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
  stageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
    marginBottom: 24,
    height: 80,
  },
  stageLeft: {
    width: 50,
    alignItems: 'center',
  },
  stageCenter: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stageRight: {
    width: 50,
    alignItems: 'center',
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E8F5E9',
    marginBottom: 8,
  },
  stageTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  stageText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  stageName: {
    fontSize: 16,
    color: '#507D2A',
    fontWeight: '700',
  },
  section: {
    marginBottom: 30,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionLabel: {
    fontSize: 18,
    color: '#2C3E50',
  },
  sectionValue: {
    fontSize: 18,
    color: '#2C3E50',
  },
  taskList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  taskText: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 8,
  },
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    backgroundColor: '#F5F6FA',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backLinkText: {
    fontSize: 18,
    color: '#2C3E50',
    marginLeft: 8,
  },
  greenhouseId: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  inactiveMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  inactiveText: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 12,
    flex: 1,
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 16,
  },
  boxContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
  },
  issueList: {
    marginTop: 8,
    minHeight: 200, // Give some height to the issue log box
  },
  stageButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
}); 