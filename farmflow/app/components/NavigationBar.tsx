import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Appbar } from 'react-native-paper';

export const NavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === '/' + path;

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Content title="FarmFlow" />
      <Appbar.Action 
        icon="view-dashboard" 
        onPress={() => router.push('/dashboard')}
        color={isActive('dashboard') ? '#2ECC71' : '#95A5A6'}
      />
      <Appbar.Action 
        icon="sprout" 
        onPress={() => router.push('/greenhouses')}
        color={isActive('greenhouses') ? '#2ECC71' : '#95A5A6'}
      />
      <Appbar.Action 
        icon="package-variant" 
        onPress={() => router.push('/inventory')}
        color={isActive('inventory') ? '#2ECC71' : '#95A5A6'}
      />
      <Appbar.Action 
        icon="chart-bar" 
        onPress={() => router.push('/reports')}
        color={isActive('reports') ? '#2ECC71' : '#95A5A6'}
      />
      <Appbar.Action 
        icon="bank" 
        onPress={() => router.push('/finance')}
        color={isActive('finance') ? '#2ECC71' : '#95A5A6'}
      />
      <Appbar.Action 
        icon="analytics" 
        onPress={() => router.push('/analytics')}
        color={isActive('analytics') ? '#2ECC71' : '#95A5A6'}
      />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
}); 