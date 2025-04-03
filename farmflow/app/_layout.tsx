import React from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { NavigationBar } from './components/NavigationBar';

export default function Layout() {
  return (
    <View style={styles.container}>
      <NavigationBar />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="greenhouses" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="finance" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
});
