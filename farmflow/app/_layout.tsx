import React from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { NavigationBar } from './components/NavigationBar';
import { AuthProvider } from './context/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <View style={styles.container}>
          <NavigationBar />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="greenhouses" />
            <Stack.Screen name="inventory" />
            <Stack.Screen name="reports" />
            <Stack.Screen name="finance" />
          </Stack>
        </View>
      </PaperProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
});
