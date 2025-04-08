import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button, List, useTheme, FAB, TextInput, Portal, Modal, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  current_quantity: number;
  unit: string;
  concentration: string;
  created_at: string;
  updated_at: string;
}

interface InventoryUsage {
  id: number;
  inventory_item: number;
  quantity_used: number;
  purpose_note: string;
  usage_date: string;
}

export default function InventoryScreen() {
  const theme = useTheme();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUseModalVisible, setIsUseModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [usageHistory, setUsageHistory] = useState<InventoryUsage[]>([]);
  
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

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      fetchUsageHistory(selectedItem.id);
    }
  }, [selectedItem]);

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/inventory/');
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
      const response = await fetch(`http://localhost:8000/api/inventory-usage/?inventory_item=${itemId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch usage history');
      }
      const data = await response.json();
      setUsageHistory(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch usage history');
    }
  };

  const handleAddItem = async () => {
    try {
      const quantity = parseFloat(newItem.current_quantity);
      if (!newItem.name.trim() || !newItem.unit.trim() || isNaN(quantity) || quantity < 0) {
        Alert.alert('Error', 'Please fill in all required fields (Name, Quantity, Unit) with valid values.');
        return;
      }

      const response = await fetch('http://localhost:8000/api/inventory/', {
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

  const handleUseItem = async () => {
    if (!selectedItem) return;
    
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

      const response = await fetch(`http://localhost:8000/api/inventory/${selectedItem.id}/record_usage/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity_used: formattedQuantity,
          purpose_note: usageForm.purpose_note.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        if (errorData.details) {
          const errorMessages = Object.entries(errorData.details)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
          Alert.alert('Validation Error', errorMessages);
        } else {
          Alert.alert('Error', errorData.error || 'Failed to record usage');
        }
        return;
      }

      setIsUseModalVisible(false);
      setUsageForm({
        quantity_used: '',
        purpose_note: '',
      });
      fetchInventory();
      fetchUsageHistory(selectedItem.id);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to record usage');
    }
  };

  const renderInventoryList = () => (
    <Card style={styles.card}>
      <Card.Title title="Inventory Items" />
      <Card.Content>
        {inventoryItems.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setSelectedItem(item)}
          >
            <List.Item
              title={item.name}
              description={`${item.current_quantity} ${item.unit} | ${item.concentration}`}
              left={props => <List.Icon {...props} icon="inventory" />}
              right={props => <MaterialIcons name="chevron-right" size={24} color="#95A5A6" />}
            />
          </TouchableOpacity>
        ))}
      </Card.Content>
    </Card>
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
              onPress={() => setIsUseModalVisible(true)}
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
          onDismiss={() => setIsUseModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Use {selectedItem?.name}
          </Text>
          <TextInput
            label="Quantity to Use"
            value={usageForm.quantity_used}
            onChangeText={text => setUsageForm({...usageForm, quantity_used: text})}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Purpose"
            value={usageForm.purpose_note}
            onChangeText={text => setUsageForm({...usageForm, purpose_note: text})}
            multiline
            style={styles.input}
          />
          <Button mode="contained" onPress={handleUseItem} style={styles.modalButton}>
            Record Usage
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
    backgroundColor: '#F5F6FA',
  },
  title: {
    margin: 16,
    color: '#2C3E50',
  },
  card: {
    margin: 16,
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
    backgroundColor: 'white',
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
}); 