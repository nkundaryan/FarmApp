import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, List, useTheme, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  lastUpdated: string;
}

export default function InventoryScreen() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const inventoryItems: InventoryItem[] = [
    {
      id: 1,
      name: 'Tomato Seeds',
      category: 'seeds',
      quantity: 5,
      unit: 'packets',
      lowStockThreshold: 10,
      lastUpdated: '2024-03-20',
    },
    {
      id: 2,
      name: 'NPK Fertilizer',
      category: 'fertilizers',
      quantity: 15,
      unit: 'kg',
      lowStockThreshold: 20,
      lastUpdated: '2024-03-19',
    },
    {
      id: 3,
      name: 'Pruning Shears',
      category: 'equipment',
      quantity: 3,
      unit: 'units',
      lowStockThreshold: 2,
      lastUpdated: '2024-03-18',
    },
    {
      id: 4,
      name: 'Pepper Seeds',
      category: 'seeds',
      quantity: 8,
      unit: 'packets',
      lowStockThreshold: 10,
      lastUpdated: '2024-03-20',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Items', icon: 'grid-view' },
    { id: 'seeds', name: 'Seeds', icon: 'eco' },
    { id: 'fertilizers', name: 'Fertilizers', icon: 'science' },
    { id: 'equipment', name: 'Equipment', icon: 'build' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? inventoryItems 
    : inventoryItems.filter(item => item.category === selectedCategory);

  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.lowStockThreshold);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text variant="headlineMedium" style={styles.title}>Inventory</Text>
        
        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <MaterialIcons 
                name={category.icon as any} 
                size={24} 
                color={selectedCategory === category.id ? '#FFFFFF' : '#95A5A6'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <Card style={styles.alertCard}>
            <Card.Title 
              title="Low Stock Alerts" 
              left={props => <List.Icon {...props} icon="warning" color="#FF5252" />}
            />
            <Card.Content>
              {lowStockItems.map(item => (
                <List.Item
                  key={item.id}
                  title={item.name}
                  description={`Current stock: ${item.quantity} ${item.unit}`}
                  left={props => <List.Icon {...props} icon="inventory" color="#FF5252" />}
                />
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Inventory Items */}
        <Card style={styles.card}>
          <Card.Title title="Inventory Items" />
          <Card.Content>
            {filteredItems.map(item => (
              <List.Item
                key={item.id}
                title={item.name}
                description={`${item.quantity} ${item.unit} | Last updated: ${new Date(item.lastUpdated).toLocaleDateString()}`}
                left={props => <List.Icon {...props} icon="inventory" />}
                right={props => (
                  <View style={styles.quantityContainer}>
                    <Text style={[
                      styles.quantityText,
                      item.quantity <= item.lowStockThreshold && styles.lowStockText
                    ]}>
                      {item.quantity}
                    </Text>
                    <Text style={styles.unitText}>{item.unit}</Text>
                  </View>
                )}
              />
            ))}
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {}}
        label="Add Item"
      />
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
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECF0F1',
  },
  selectedCategory: {
    backgroundColor: '#2ECC71',
    borderColor: '#2ECC71',
  },
  categoryText: {
    marginLeft: 8,
    color: '#95A5A6',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  alertCard: {
    margin: 16,
    backgroundColor: '#FFEBEE',
  },
  card: {
    margin: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  lowStockText: {
    color: '#FF5252',
  },
  unitText: {
    marginLeft: 4,
    color: '#95A5A6',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2ECC71',
  },
}); 