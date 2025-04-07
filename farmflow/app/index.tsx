import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  loginContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  appTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#507D2A",
    marginBottom: 40,
  },
  formContainer: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    width: "100%",
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  errorMessage: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 15,
    width: "100%",
  },
  inputField: {
    width: "100%",
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  submitButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#507D2A",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  submitButtonDisabled: {
    backgroundColor: "#88AA6F",
  },
});

export default function SignIn() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      if (!username.trim() || !password.trim()) {
        setError("Please enter username and password.");
        return;
      }

      setIsLoading(true);
      setError("");

      const loginData = {
        username: username.trim(),
        password: password.trim()
      };

      console.log('Sending login request:', {
        url: `${API_URL}/api-token-auth/`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: loginData
      });

      const response = await fetch(`${API_URL}/api-token-auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      console.log('Server response:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });

      if (response.ok && data.token) {
        await AsyncStorage.setItem('auth_token', data.token);
        router.push("/dashboard");
      } else {
        setError(data.non_field_errors?.[0] || data.detail || "Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.appTitle}>FarmFlow</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Sign In</Text>
          
          {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
          
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.inputField}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.inputField}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled
            ]}
            onPress={handleSignIn}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Sign In"
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
