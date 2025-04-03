import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
}

export default function GreenhousesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGreenhouses();
  }, []);

  const fetchGreenhouses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/greenhouses/');
      if (!response.ok) {
        throw new Error('Failed to fetch greenhouses');
      }
      const data = await response.json();
      setGreenhouses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching greenhouses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGreenhousePress = (id: number) => {
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
      filtered = filtered.filter(g => g.status === statusFilter);
    }
    
    return filtered;
  }, [greenhouses, statusFilter]);

  const activeCount = greenhouses.filter(g => g.status === 'active').length;
  const maintenanceCount = greenhouses.filter(g => g.status === 'maintenance').length;
  const inactiveCount = greenhouses.filter(g => g.status === 'inactive').length;

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

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
        <TouchableOpacity style={styles.retryButton} onPress={fetchGreenhouses}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            {filteredGreenhouses.map((greenhouse) => (
              <TouchableOpacity
                key={greenhouse.id}
                style={styles.tileContainer}
                onPress={() => handleGreenhousePress(greenhouse.id)}
              >
                <View style={styles.tile}>
                  <View style={styles.tileHeader}>
                    <Text style={styles.tileName}>{greenhouse.name}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(greenhouse.status) }
                    ]}>
                      <Text style={styles.statusText}>
                        {greenhouse.status}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.sizeInfo}>
                    <MaterialIcons name="straighten" size={20} color="#666" />
                    <Text style={styles.sizeText}>{greenhouse.size} sq ft</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            {filteredGreenhouses.map((greenhouse) => (
              <TouchableOpacity
                key={greenhouse.id}
                style={styles.listItem}
                onPress={() => handleGreenhousePress(greenhouse.id)}
              >
                <View style={styles.listItemHeader}>
                  <Text style={styles.listItemName}>{greenhouse.name}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(greenhouse.status) }
                  ]}>
                    <Text style={styles.statusText}>
                      {greenhouse.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.sizeInfo}>
                  <MaterialIcons name="straighten" size={20} color="#666" />
                  <Text style={styles.sizeText}>{greenhouse.size} sq ft</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
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
});