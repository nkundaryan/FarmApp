import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

interface FormErrors {
  name?: string;
  size?: string;
}

export default function NewGreenhouseScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    size: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Reset errors
    setErrors({});

    // Basic validation
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.size.trim()) {
      newErrors.size = 'Size is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      console.log('Sending request to create greenhouse...');
      const response = await fetch('http://localhost:8000/api/greenhouses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          size: parseFloat(formData.size),
          status: 'inactive',
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || 'Failed to create greenhouse');
      }

      const data = await response.json();
      console.log('Successfully created greenhouse:', data);
      
      router.back();
    } catch (error) {
      console.error('Error creating greenhouse:', error);
      setErrors({ name: error instanceof Error ? error.message : 'Failed to create greenhouse. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Greenhouse</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter greenhouse name"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Size (sq ft)</Text>
        <TextInput
          style={[styles.input, errors.size && styles.inputError]}
          value={formData.size}
          onChangeText={(text) => setFormData({ ...formData, size: text })}
          placeholder="Enter greenhouse size"
          keyboardType="numeric"
        />
        {errors.size && <Text style={styles.errorText}>{errors.size}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Create Greenhouse</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#2C3E50',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#34495E',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#34495E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#95A5A6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 