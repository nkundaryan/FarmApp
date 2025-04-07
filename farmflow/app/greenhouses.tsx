import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchGreenhouses, setSelectedGreenhouse, updateGreenhouseStatus } from './store/slices/greenhouseSlice';
import { RootState } from './store';

const { width } = Dimensions.get('window');
const PADDING = 12;
const GAP = 12;
// Calculate tile width for 3 columns with padding and gaps
const TILE_WIDTH = (width - (2 * PADDING) - (2 * GAP)) / 3;

type ViewMode = 'grid' | 'list';
type Status = 'active' | 'maintenance' | 'inactive';

interface Greenhouse {
  id: number;
  name: string;
  size: number;
  status: Status;
  created_at: string;
  updated_at: string;
  current_cycle?: {
    crop_name: string;
    seed_type: string;
    planting_date: string;
    expected_harvest_date: string;
    status: string;
  };
}

export default function GreenhousesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { greenhouses, loading, error } = useAppSelector((state: RootState) => state.greenhouse);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [selectedGreenhouse, setSelectedGreenhouseForStatus] = useState<Greenhouse | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGreenhouse, setNewGreenhouse] = useState({
    name: '',
    size: '',
  });

  useEffect(() => {
    dispatch(fetchGreenhouses());
  }, [dispatch]);

  const handleGreenhousePress = (id: number) => {
    const selectedGreenhouse = greenhouses.find((g: Greenhouse) => g.id === id);
    if (selectedGreenhouse) {
      dispatch(setSelectedGreenhouse(selectedGreenhouse));
    }
    router.push(`/greenhouse/${id}`);
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'active':
        return '#4CAF50';  // Green
      case 'maintenance':
        return '#FFA726';  // Orange
      case 'inactive':
        return '#FF5252';  // Red
      default:
        return '#757575';  // Grey
    }
  };

  // Filter greenhouses
  const filteredGreenhouses = useMemo(() => {
    let filtered = greenhouses;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter((g: Greenhouse) => g.status === statusFilter);
    }
    
    return filtered;
  }, [greenhouses, statusFilter]);

  const activeCount = greenhouses.filter((g: Greenhouse) => g.status === 'active').length;
  const maintenanceCount = greenhouses.filter((g: Greenhouse) => g.status === 'maintenance').length;
  const inactiveCount = greenhouses.filter((g: Greenhouse) => g.status === 'inactive').length;

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const handleStatusChange = async (newStatus: Status) => {
    if (selectedGreenhouse) {
      try {
        await dispatch(updateGreenhouseStatus({ 
          id: selectedGreenhouse.id, 
          status: newStatus 
        })).unwrap();
        setShowStatusModal(false);
        setSelectedGreenhouseForStatus(null);
      } catch (error) {
        console.error('Failed to update status:', error);
      }
    }
  };

  const StatusModal = () => (
    <Modal
      visible={showStatusModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowStatusModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Change Status</Text>
          <TouchableOpacity 
            style={[styles.statusOption, { backgroundColor: '#4CAF50' }]}
            onPress={() => handleStatusChange('active')}
          >
            <Text style={styles.statusOptionText}>Set as Active</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statusOption, { backgroundColor: '#FFA726' }]}
            onPress={() => handleStatusChange('maintenance')}
          >
            <Text style={styles.statusOptionText}>Set as Maintenance</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statusOption, { backgroundColor: '#FF5252' }]}
            onPress={() => handleStatusChange('inactive')}
          >
            <Text style={styles.statusOptionText}>Set as Inactive</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setShowStatusModal(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#34495E" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(fetchGreenhouses())}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderGreenhouseItem = (item: Greenhouse) => {
    return (
      <TouchableOpacity
        style={styles.greenhouseItem}
        onPress={() => router.push(`/greenhouse/${item.id}`)}
      >
        <View style={styles.greenhouseHeader}>
          <Text style={styles.greenhouseName}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.greenhouseInfo}>
          <View style={styles.infoRow}>
            <MaterialIcons name="straighten" size={20} color="#666" />
            <Text style={styles.infoText}>Size: {item.size} sq ft</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="update" size={20} color="#7F8C8D" />
            <Text style={styles.infoText}>
              Last Updated: {new Date(item.updated_at).toLocaleDateString()}
            </Text>
          </View>
          {item.status === 'active' && item.current_cycle && (
            <>
              <View style={styles.infoRow}>
                <MaterialIcons name="eco" size={20} color="#4CAF50" />
                <Text style={styles.infoText}>
                  Growing: {item.current_cycle.crop_name} ({item.current_cycle.seed_type})
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="event" size={20} color="#4CAF50" />
                <Text style={styles.infoText}>
                  Harvest: {new Date(item.current_cycle.expected_harvest_date).toLocaleDateString()}
                </Text>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialIcons name="local-florist" size={32} color="#34495E" />
          <Text style={styles.title}>Greenhouses</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={toggleViewMode}
          >
            <MaterialIcons 
              name={viewMode === 'grid' ? 'view-list' : 'grid-view'} 
              size={24} 
              color="#34495E" 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/greenhouse/new')}
          >
            <MaterialIcons 
              name="add" 
              size={24} 
              color="#34495E" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Filter Tiles */}
      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={[
            styles.statItem, 
            { backgroundColor: statusFilter === 'active' ? '#34495E' : '#F8F9FA' }
          ]}
          onPress={() => setStatusFilter('active')}
        >
          <Text style={[
            styles.statValue, 
            { color: statusFilter === 'active' ? '#FFFFFF' : '#2C3E50' }
          ]}>{activeCount}</Text>
          <Text style={[
            styles.statLabel, 
            { color: statusFilter === 'active' ? '#E0E0E0' : '#7F8C8D' }
          ]}>Active</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.statItem, 
            { backgroundColor: statusFilter === 'maintenance' ? '#7F8C8D' : '#F8F9FA' }
          ]}
          onPress={() => setStatusFilter('maintenance')}
        >
          <Text style={[
            styles.statValue, 
            { color: statusFilter === 'maintenance' ? '#FFFFFF' : '#2C3E50' }
          ]}>{maintenanceCount}</Text>
          <Text style={[
            styles.statLabel, 
            { color: statusFilter === 'maintenance' ? '#E0E0E0' : '#7F8C8D' }
          ]}>Maintenance</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.statItem, 
            { backgroundColor: statusFilter === 'inactive' ? '#BDC3C7' : '#F8F9FA' }
          ]}
          onPress={() => setStatusFilter('inactive')}
        >
          <Text style={[
            styles.statValue, 
            { color: statusFilter === 'inactive' ? '#FFFFFF' : '#2C3E50' }
          ]}>{inactiveCount}</Text>
          <Text style={[
            styles.statLabel, 
            { color: statusFilter === 'inactive' ? '#E0E0E0' : '#7F8C8D' }
          ]}>Inactive</Text>
        </TouchableOpacity>
      </View>

      {/* View All Button */}
      {statusFilter !== 'all' && (
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => setStatusFilter('all')}
        >
          <MaterialIcons name="clear-all" size={16} color="#34495E" />
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.scrollView}>
        {viewMode === 'grid' ? (
          <View style={styles.grid}>
            {filteredGreenhouses.map(renderGreenhouseItem)}
          </View>
        ) : (
          <View style={styles.list}>
            {filteredGreenhouses.map(renderGreenhouseItem)}
          </View>
        )}
      </ScrollView>

      <StatusModal />
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
    justifyContent: 'space-between',
    padding: PADDING,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: PADDING,
    gap: GAP,
  },
  statItem: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECF0F1',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  statLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: PADDING,
    marginBottom: PADDING,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#ECF0F1',
  },
  viewAllText: {
    fontSize: 14,
    color: '#34495E',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    padding: PADDING,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    justifyContent: 'flex-start',
  },
  tileContainer: {
    width: TILE_WIDTH,
  },
  tile: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECF0F1',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  sizeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  sizeText: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: PADDING,
    gap: GAP,
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECF0F1',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#34495E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusOption: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  statusOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  greenhouseItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECF0F1',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginBottom: 12,
  },
  greenhouseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  greenhouseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  greenhouseInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
});