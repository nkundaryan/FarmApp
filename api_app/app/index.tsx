import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (email.trim() && password.trim()) {
      router.push("/transcribe"); // Navigate to Transcribe Page
    } else {
      Alert.alert("Error", "Please enter email and password.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Navigation Bar (Removed Shadow) */}
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Special Olympics</Text>
      </View>

      {/* Floating Sign-In Form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign In</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Sign-In Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, // Ensures proper spacing
  },
  navBar: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  navTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#B22222",
  },
  formContainer: {
    width: "90%",
    maxWidth: 380,
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 12,
    shadowColor: "#000", // Shadow for floating effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Android shadow effect
    alignItems: "center", // Centers text inside the form
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#B22222",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
