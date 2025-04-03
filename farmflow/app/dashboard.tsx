import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List, useTheme } from 'react-native-paper';

export default function Dashboard() {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Dashboard</Text>
      
      <Card style={styles.card}>
        <Card.Title title="Active Greenhouses" subtitle="3 greenhouses" />
        <Card.Content>
          <List.Item
            title="Greenhouse A"
            description="Temperature: 24°C | Humidity: 65%"
            left={props => <List.Icon {...props} icon="sprout" />}
          />
          <List.Item
            title="Greenhouse B"
            description="Temperature: 22°C | Humidity: 70%"
            left={props => <List.Icon {...props} icon="sprout" />}
          />
          <List.Item
            title="Greenhouse C"
            description="Temperature: 23°C | Humidity: 68%"
            left={props => <List.Icon {...props} icon="sprout" />}
          />
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => {}}>View All</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Recent Reports" subtitle="Last 7 days" />
        <Card.Content>
          <List.Item
            title="Weekly Growth Report"
            description="Updated 2 hours ago"
            left={props => <List.Icon {...props} icon="file-document" />}
          />
          <List.Item
            title="Resource Usage"
            description="Updated yesterday"
            left={props => <List.Icon {...props} icon="file-chart" />}
          />
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => {}}>View All Reports</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
});

