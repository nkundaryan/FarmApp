import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button, List, useTheme, FAB, TextInput, Portal, Modal, Divider, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from './config';

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  current_quantity: number;
  unit: string;
  concentration: string;
  created_at: string;
  updated_at: string;
  batch_number?: string;
  expiration_date?: string;
}

interface InventoryUsage {
  id: number;
  inventory_item: number;
  quantity_used: number;
  purpose_note: string;
  usage_date: string;
}

interface Greenhouse {
  id: number;
  name: string;
  status: string;
}

export default function InventoryScreen() {
  const theme = useTheme();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUseModalVisible, setIsUseModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [usageHistory, setUsageHistory] = useState<InventoryUsage[]>([]);
  const [activeGreenhouses, setActiveGreenhouses] = useState<Greenhouse[]>([]);
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState<number | null>(null);
  
  // Form states
  const [usageForm, setUsageForm] = useState({
    quantity_used: '',
    purpose_note: '',
  });
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    current_quantity: '',
    unit: '',
    concentration: '',
  });

  const [isRestockModalVisible, setIsRestockModalVisible] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState('');
  const [restockItemId, setRestockItemId] = useState<number | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      fetchUsageHistory(selectedItem.id);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (isUseModalVisible) {
      fetchActiveGreenhouses();
    }
  }, [isUseModalVisible]);

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/inventory/`);
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
      const data = await response.json();
      setInventoryItems(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsageHistory = async (itemId: number) => {
    try {
      const response = await fetch(`${API_URL}/api/inventory-usage/?inventory_item=${itemId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch usage history');
      }
      const data = await response.json();
      setUsageHistory(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch usage history');
    }
  };

  const fetchActiveGreenhouses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/greenhouses/?status=active`);
      if (!response.ok) {
        throw new Error('Failed to fetch active greenhouses');
      }
      const data = await response.json();
      setActiveGreenhouses(data);
    } catch (error) {
      Alert.alert('Error', 'Could not load active greenhouses.');
      setActiveGreenhouses([]);
    }
  };

  const handleAddItem = async () => {
    try {
      const quantity = parseFloat(newItem.current_quantity);
      if (!newItem.name.trim() || !newItem.unit.trim() || isNaN(quantity) || quantity < 0) {
        Alert.alert('Error', 'Please fill in all required fields (Name, Quantity, Unit) with valid values.');
        return;
      }

      const response = await fetch(`${API_URL}/api/inventory/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newItem,
          current_quantity: quantity,
          name: newItem.name.trim(),
          description: newItem.description.trim(),
          unit: newItem.unit.trim(),
          concentration: newItem.concentration.trim(),
        }),
      });

      if (!response.ok) {
         const errorData = await response.json();
         console.error("Add Item Error:", errorData);
         const errorMessages = errorData.details ? Object.entries(errorData.details)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n') : (errorData.error || 'Failed to add item');
         Alert.alert('Error', errorMessages);
        return;
      }

      setIsAddModalVisible(false);
      setNewItem({
        name: '',
        description: '',
        current_quantity: '',
        unit: '',
        concentration: '',
      });
      fetchInventory();
    } catch (error: any) {
      console.error("Add Item Exception:", error);
      Alert.alert('Error', error.message || 'Failed to add item');
    }
  };

  const handleRestock = (itemId: number) => {
    setRestockItemId(itemId);
    setIsRestockModalVisible(true);
  };

  const confirmRestock = async () => {
    const parsedQuantity = parseFloat(restockQuantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity greater than 0');
      return;
    }

    const selectedItem = inventoryItems.find(item => item.id === restockItemId);
    if (selectedItem) {
      const updatedQuantity = selectedItem.current_quantity + parsedQuantity;
      // Update the state
      setInventoryItems(prevItems =>
        prevItems.map(item =>
          item.id === restockItemId ? { ...item, current_quantity: updatedQuantity } : item
        )
      );

      // Optionally, send the update to the backend
      try {
        const response = await fetch(`${API_URL}/api/inventory/${restockItemId}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ current_quantity: updatedQuantity }),
        });

        if (!response.ok) {
          throw new Error('Failed to update inventory');
        }

        Alert.alert('Success', 'Inventory updated successfully');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update inventory';
        Alert.alert('Error', errorMessage);
      }
    }
    setIsRestockModalVisible(false);
    setRestockQuantity('');
  };

  const useItem = async (itemId: number) => {
    const selectedItem = inventoryItems.find(item => item.id === itemId);
    if (!selectedItem || selectedGreenhouseId === null) {
      Alert.alert('Error', 'Please select an active greenhouse.');
      return;
    }

    try {
      const quantity = parseFloat(usageForm.quantity_used);
      if (isNaN(quantity) || quantity <= 0) {
        Alert.alert('Error', 'Please enter a valid quantity greater than 0');
        return;
      }

      if (quantity > selectedItem.current_quantity) {
        Alert.alert('Error', `Cannot use more than available quantity (${selectedItem.current_quantity} ${selectedItem.unit})`);
        return;
      }

      if (!usageForm.purpose_note.trim()) {
        Alert.alert('Error', 'Please enter a purpose for using this item');
        return;
      }

      const formattedQuantity = quantity.toFixed(2);
      const greenhouseIdToSend = selectedGreenhouseId;

      const response = await fetch(`${API_URL}/api/inventory/${selectedItem.id}/record_usage/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity_used: formattedQuantity,
          purpose_note: usageForm.purpose_note.trim(),
          greenhouse_id: greenhouseIdToSend,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        const errorMessage = errorData.error || (errorData.details ? JSON.stringify(errorData.details) : 'Failed to record usage');
        Alert.alert('Error', errorMessage);
        return;
      }

      setIsUseModalVisible(false);
      setUsageForm({ quantity_used: '', purpose_note: '' });
      setSelectedGreenhouseId(null);
      fetchInventory();
      fetchUsageHistory(selectedItem.id);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to record usage');
    }
  };

  const handleUseItem = (itemId: number) => {
    setSelectedItem(inventoryItems.find(item => item.id === itemId) || null);
    setIsUseModalVisible(true);
  };

  const openUseModal = (itemId: number) => {
    setSelectedItem(inventoryItems.find(item => item.id === itemId) || null);
    setIsUseModalVisible(true);
  };

  const renderInventoryList = () => (
    <View style={styles.gridContainer}>
      {inventoryItems.map(item => (
        <TouchableOpacity
          key={item.id}
          onPress={() => setSelectedItem(item)}
          style={styles.inventoryItem}
        >
          <View style={styles.inventoryHeader}>
            <Text style={styles.inventoryName}>{item.name}</Text>
            <MaterialIcons name="chevron-right" size={24} color="#95A5A6" />
          </View>
          <View style={styles.inventoryInfo}>
            <Text style={styles.infoText}>{`${item.current_quantity} ${item.unit} | ${item.concentration}`}</Text>
            {item.current_quantity < 10 && (
              <Text style={styles.alertText}>Low Stock</Text>
            )}
            <Text style={styles.infoText}>Batch: {item.batch_number || 'N/A'}</Text>
            <Text style={styles.infoText}>Expires: {item.expiration_date || 'N/A'}</Text>
          </View>
          <View style={styles.actionButtons}>
            <Button mode="outlined" onPress={() => handleRestock(item.id)}>Restock</Button>
            <Button mode="contained" onPress={() => openUseModal(item.id)}>Use</Button>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderItemDetails = () => {
    if (!selectedItem) return null;

    return (
      <View style={styles.detailsContainer}>
        <Card style={styles.card}>
          <Card.Title 
            title={selectedItem.name}
            subtitle={`${selectedItem.current_quantity} ${selectedItem.unit}`}
          />
          <Card.Content>
            <Text style={styles.detailText}>
              Description: {selectedItem.description || 'No description'}
            </Text>
            <Text style={styles.detailText}>
              Concentration: {selectedItem.concentration || 'Not specified'}
            </Text>
            <Text style={styles.detailText}>
              Last Updated: {new Date(selectedItem.updated_at).toLocaleDateString()}
            </Text>
            
            <Button
              mode="contained"
              onPress={() => openUseModal(selectedItem.id)}
              style={styles.useButton}
            >
              Use Item
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Usage History" />
          <Card.Content>
            {usageHistory.length === 0 ? (
              <Text style={styles.noHistoryText}>No usage history available</Text>
            ) : (
              usageHistory.map(usage => (
                <View key={usage.id} style={styles.usageItem}>
                  <Text style={styles.usageDate}>
                    {new Date(usage.usage_date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.usageQuantity}>
                    Used: {usage.quantity_used} {selectedItem.unit}
                  </Text>
                  <Text style={styles.usagePurpose}>
                    Purpose: {usage.purpose_note}
                  </Text>
                  <Divider style={styles.divider} />
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text variant="headlineMedium" style={styles.title}>Inventory</Text>
        
        {selectedItem ? (
          <>
            <Button
              mode="outlined"
              onPress={() => setSelectedItem(null)}
              style={styles.backButton}
              icon="arrow-left"
            >
              Back to Inventory
            </Button>
            {renderItemDetails()}
          </>
        ) : (
          renderInventoryList()
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={isAddModalVisible}
          onDismiss={() => setIsAddModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>Add New Item</Text>
          <TextInput
            label="Name *"
            value={newItem.name}
            onChangeText={text => setNewItem({...newItem, name: text})}
            style={styles.input}
          />
          <TextInput
            label="Description"
            value={newItem.description}
            onChangeText={text => setNewItem({...newItem, description: text})}
            style={styles.input}
          />
          <TextInput
            label="Quantity *"
            value={newItem.current_quantity}
            onChangeText={text => setNewItem({...newItem, current_quantity: text})}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Unit *"
            value={newItem.unit}
            onChangeText={text => setNewItem({...newItem, unit: text})}
            style={styles.input}
          />
          <TextInput
            label="Concentration"
            value={newItem.concentration}
            onChangeText={text => setNewItem({...newItem, concentration: text})}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleAddItem} style={styles.modalButton}>
            Add Item
          </Button>
        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={isUseModalVisible}
          onDismiss={() => {
            setIsUseModalVisible(false);
            setSelectedGreenhouseId(null);
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Use {selectedItem?.name}
          </Text>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Select Greenhouse *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.greenhouseScrollView}>
              {activeGreenhouses.length === 0 ? (
                <Text style={styles.noGreenhousesText}>No active greenhouses found.</Text>
              ) : (
                activeGreenhouses.map((gh) => (
                  <Button
                    key={gh.id}
                    mode={selectedGreenhouseId === gh.id ? 'contained' : 'outlined'}
                    onPress={() => setSelectedGreenhouseId(gh.id)}
                    style={styles.greenhouseButton}
                    compact
                  >
                    {gh.name}
                  </Button>
                ))
              )}
            </ScrollView>
          </View>

          <TextInput
            label="Quantity to Use *"
            value={usageForm.quantity_used}
            onChangeText={text => setUsageForm({...usageForm, quantity_used: text})}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Purpose *"
            value={usageForm.purpose_note}
            onChangeText={text => setUsageForm({...usageForm, purpose_note: text})}
            multiline
            style={styles.input}
          />
          <Button 
            mode="contained" 
            onPress={() => useItem(selectedItem?.id || 0)} 
            style={styles.modalButton}
            disabled={!selectedGreenhouseId}
           >
            Record Usage
          </Button>
        </Modal>
      </Portal>

      <Portal>
        <Modal visible={isRestockModalVisible} onDismiss={() => setIsRestockModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <Text variant="headlineSmall" style={styles.modalTitle}>Restock Item</Text>
          <TextInput
            label="Quantity to Add"
            value={restockQuantity}
            onChangeText={setRestockQuantity}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button mode="contained" onPress={confirmRestock} style={styles.modalButton}>
            Confirm
          </Button>
        </Modal>
      </Portal>

      {!selectedItem && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setIsAddModalVisible(true)}
          label="Add Item"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  title: {
    margin: 16,
    color: '#2C3E50',
  },
  card: {
    margin: 16,
    backgroundColor: '#f0f0f0',
  },
  detailsContainer: {
    flex: 1,
  },
  detailText: {
    marginBottom: 8,
    fontSize: 16,
  },
  useButton: {
    marginTop: 16,
  },
  backButton: {
    margin: 16,
  },
  usageItem: {
    marginBottom: 16,
  },
  usageDate: {
    fontSize: 14,
    color: '#95A5A6',
  },
  usageQuantity: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  usagePurpose: {
    fontSize: 14,
    marginTop: 4,
    color: '#34495E',
  },
  divider: {
    marginTop: 8,
  },
  noHistoryText: {
    textAlign: 'center',
    color: '#95A5A6',
    fontStyle: 'italic',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2ECC71',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    marginLeft: 4, 
  },
  greenhouseScrollView: {
    maxHeight: 100,
  },
  greenhouseButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  noGreenhousesText: {
    fontStyle: 'italic',
    color: '#888',
    padding: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  inventoryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECF0F1',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
    width: '48%',
  },
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inventoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  inventoryInfo: {
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  alertText: {
    color: 'red',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
}); 