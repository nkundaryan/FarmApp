import React from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { GreenhouseProvider } from './context';

export default function Layout() {
  return (
    <GreenhouseProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="greenhouse" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="greenhouse/new" 
          options={{ 
            headerShown: false 
          }} 
        />
      </Stack>
    </GreenhouseProvider>
  );
}
