import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export const NavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navItem, isActive('/dashboard') && styles.activeItem]}
        onPress={() => router.push('/dashboard')}
      >
        <MaterialIcons
          name="dashboard"
          size={24}
          color={isActive('/dashboard') ? '#2ECC71' : '#95A5A6'}
        />
        <Text style={[styles.label, isActive('/dashboard') && styles.activeLabel]}>Overview</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, isActive('/greenhouses') && styles.activeItem]}
        onPress={() => router.push('/greenhouses')}
      >
        <MaterialIcons
          name="local-florist"
          size={24}
          color={isActive('/greenhouses') ? '#2ECC71' : '#95A5A6'}
        />
        <Text style={[styles.label, isActive('/greenhouses') && styles.activeLabel]}>Greenhouses</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, isActive('/reports') && styles.activeItem]}
        onPress={() => router.push('/reports')}
      >
        <MaterialIcons
          name="assessment"
          size={24}
          color={isActive('/reports') ? '#2ECC71' : '#95A5A6'}
        />
        <Text style={[styles.label, isActive('/reports') && styles.activeLabel]}>Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, isActive('/finance') && styles.activeItem]}
        onPress={() => router.push('/finance')}
      >
        <MaterialIcons
          name="account-balance"
          size={24}
          color={isActive('/finance') ? '#2ECC71' : '#95A5A6'}
        />
        <Text style={[styles.label, isActive('/finance') && styles.activeLabel]}>Finance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
    paddingVertical: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#2ECC71',
  },
  label: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 4,
  },
  activeLabel: {
    color: '#2ECC71',
  },
}); 