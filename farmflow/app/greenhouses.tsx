import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { GreenhouseTile } from './components/GreenhouseTile';

const { width } = Dimensions.get('window');
const PADDING = 12;
const GAP = 12;
// Calculate tile width for 3 columns with padding and gaps
const TILE_WIDTH = (width - (2 * PADDING) - (2 * GAP)) / 3;

type ViewMode = 'grid' | 'list';

export default function GreenhousesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'maintenance' | 'inactive'>('all');

  const greenhouses = [
    {
      id: 1,
      name: 'Tomatoes',
      size: '1000 sq ft',
      temperature: 24,
      humidity: 65,
      status: 'active' as const,
    },
    {
      id: 2,
      name: 'Peppers',
      size: '800 sq ft',
      temperature: 22,
      humidity: 70,
      status: 'active' as const,
    },
    {
      id: 3,
      name: 'Cucumbers',
      size: '1200 sq ft',
      temperature: 25,
      humidity: 68,
      status: 'maintenance' as const,
    },
    {
      id: 4,
      name: 'Lettuce',
      size: '900 sq ft',
      temperature: 23,
      humidity: 72,
      status: 'active' as const,
    },
    {
      id: 5,
      name: 'Herbs',
      size: '1100 sq ft',
      temperature: 21,
      humidity: 75,
      status: 'inactive' as const,
    },
    {
      id: 6,
      name: 'Strawberries',
      size: '950 sq ft',
      temperature: 23,
      humidity: 70,
      status: 'active' as const,
    },
    {
      id: 7,
      name: 'Flowers',
      size: '850 sq ft',
      temperature: 22,
      humidity: 68,
      status: 'maintenance' as const,
    },
    {
      id: 8,
      name: 'Seedlings',
      size: '600 sq ft',
      temperature: 24,
      humidity: 71,
      status: 'active' as const,
    },
    {
      id: 9,
      name: 'Research',
      size: '750 sq ft',
      temperature: 23,
      humidity: 69,
      status: 'active' as const,
    },
  ];

  const handleGreenhousePress = (id: number) => {
    router.push(`/greenhouse/${id}`);
  };

  const handleAddGreenhouse = () => {
    router.push('/greenhouse/new');
  };

  // Filter greenhouses
  const filteredGreenhouses = useMemo(() => {
    // First filter by search query
    let filtered = greenhouses.filter(g => 
      g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Then filter by status if not 'all'
    if (statusFilter !== 'all') {
      filtered = filtered.filter(g => g.status === statusFilter);
    }
    
    return filtered;
  }, [greenhouses, searchQuery, statusFilter]);

  const activeCount = greenhouses.filter(g => g.status === 'active').length;
  const maintenanceCount = greenhouses.filter(g => g.status === 'maintenance').length;
  const inactiveCount = greenhouses.filter(g => g.status === 'inactive').length;

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
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
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#7F8C8D" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search greenhouses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#95A5A6"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={20} color="#7F8C8D" />
          </TouchableOpacity>
        )}
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
        {filteredGreenhouses.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={48} color="#BDC3C7" />
            <Text style={styles.emptyStateText}>No greenhouses found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : viewMode === 'grid' ? (
          <View style={styles.grid}>
            {filteredGreenhouses.map((greenhouse) => (
              <View key={greenhouse.id} style={styles.tileContainer}>
                <GreenhouseTile
                  name={greenhouse.name}
                  size={greenhouse.size}
                  temperature={greenhouse.temperature}
                  humidity={greenhouse.humidity}
                  status={greenhouse.status}
                  onPress={() => handleGreenhousePress(greenhouse.id)}
                />
              </View>
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
                  <View style={styles.listItemTitle}>
                    <MaterialIcons name="local-florist" size={20} color="#34495E" />
                    <Text style={styles.listItemName}>{greenhouse.name}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: greenhouse.status === 'active' ? '#34495E' : 
                                      greenhouse.status === 'maintenance' ? '#7F8C8D' : '#BDC3C7' }
                  ]}>
                    <Text style={styles.statusText}>
                      {greenhouse.status.charAt(0).toUpperCase() + greenhouse.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.listItemDetails}>
                  <View style={styles.listItemDetail}>
                    <MaterialIcons name="straighten" size={16} color="#7F8C8D" />
                    <Text style={styles.listItemDetailText}>{greenhouse.size}</Text>
                  </View>
                  <View style={styles.listItemDetail}>
                    <MaterialIcons name="thermostat" size={16} color="#7F8C8D" />
                    <Text style={styles.listItemDetailText}>{greenhouse.temperature}°C</Text>
                  </View>
                  <View style={styles.listItemDetail}>
                    <MaterialIcons name="water-drop" size={16} color="#7F8C8D" />
                    <Text style={styles.listItemDetailText}>{greenhouse.humidity}%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddGreenhouse}
      >
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add New Greenhouse</Text>
      </TouchableOpacity>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: PADDING,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECF0F1',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#2C3E50',
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
  listItemTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  listItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listItemDetailText: {
    fontSize: 14,
    color: '#34495E',
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34495E',
    margin: PADDING,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 