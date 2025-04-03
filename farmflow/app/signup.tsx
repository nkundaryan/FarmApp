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
  signupContainer: {
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
    marginBottom: 15,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  submitButtonDisabled: {
    backgroundColor: "#88AA6F",
  },
  loginLink: {
    marginTop: 20,
  },
  loginLinkText: {
    color: "#507D2A",
    fontSize: 16,
  }
});

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      // Basic validation
      if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setError("All fields are required.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setIsLoading(true);
      setError("");

      // First, create the user
      const signupResponse = await fetch(`${API_URL}/api/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        throw new Error(signupData.detail || "Failed to create account");
      }

      // If signup successful, automatically log in
      const loginResponse = await fetch(`${API_URL}/api-token-auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok && loginData.token) {
        await AsyncStorage.setItem('auth_token', loginData.token);
        router.push("/dashboard");
      } else {
        throw new Error("Account created but failed to log in");
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.signupContainer}>
        <Text style={styles.appTitle}>FarmFlow</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Create Account</Text>
          
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
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
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

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.inputField}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => router.push("/")}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
} 