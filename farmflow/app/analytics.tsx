import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';

// Sample data for the chart and table
const greenhouseData = [
  { id: 'GH1', crop: 'Tomato', quantity: 500, income: 1000 },
  { id: 'GH2', crop: 'Lettuce', quantity: 150, income: 300 },
  { id: 'GH3', crop: 'Tomatoes', quantity: 350, income: 700 },
  { id: 'GH4', crop: 'Strawberries', quantity: 625, income: 1250 },
  { id: 'GH5', crop: 'Mixed Greens', quantity: 275, income: 550 },
];

export default function AnalyticsScreen() {
  const [timeframe, setTimeframe] = useState('Weekly');

  // Find the maximum quantity for scaling the bars
  const maxQuantity = Math.max(...greenhouseData.map(gh => gh.quantity));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FarmFlow</Text>
        <Text style={styles.subtitle}>Reports</Text>
      </View>

      <View style={styles.timeframeContainer}>
        {['Weekly', 'Monthly', 'Cumulative'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.timeframeButton,
              timeframe === period && styles.timeframeButtonActive
            ]}
            onPress={() => setTimeframe(period)}
          >
            <Text style={[
              styles.timeframeText,
              timeframe === period && styles.timeframeTextActive
            ]}>
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart Section */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Harvest Quantity</Text>
        <View style={styles.chart}>
          <View style={styles.yAxis}>
            {[600, 400, 200, 0].map((value) => (
              <Text key={value} style={styles.axisLabel}>{value}</Text>
            ))}
          </View>
          <View style={styles.barsContainer}>
            {greenhouseData.map((gh) => (
              <View key={gh.id} style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { height: (gh.quantity / maxQuantity) * 200 }
                  ]} 
                />
                <Text style={styles.barLabel}>{gh.id}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Table Section */}
      <DataTable style={styles.table}>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title>Greenhouse</DataTable.Title>
          <DataTable.Title>Crop</DataTable.Title>
          <DataTable.Title numeric>Quantity Harvested</DataTable.Title>
          <DataTable.Title numeric>Income</DataTable.Title>
        </DataTable.Header>

        {greenhouseData.map((item) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell>{item.id}</DataTable.Cell>
            <DataTable.Cell>{item.crop}</DataTable.Cell>
            <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
            <DataTable.Cell numeric>{item.income}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 8,
  },
  timeframeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  timeframeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F6FA',
  },
  timeframeButtonActive: {
    backgroundColor: '#E8E8E8',
  },
  timeframeText: {
    color: '#666666',
    fontSize: 16,
  },
  timeframeTextActive: {
    color: '#2C3E50',
    fontWeight: '500',
  },
  chartContainer: {
    padding: 20,
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    height: 250,
    alignItems: 'flex-end',
  },
  yAxis: {
    width: 40,
    height: 220,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginRight: 10,
  },
  axisLabel: {
    color: '#666666',
    fontSize: 12,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 220,
    gap: 20,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    backgroundColor: '#7CB342',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    marginTop: 8,
    color: '#666666',
    fontSize: 12,
  },
  table: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  tableHeader: {
    backgroundColor: '#F5F6FA',
  },
}); 