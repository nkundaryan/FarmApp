import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Transcribe() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.navTitle}>Special Olympics</Text>
      <Text style={styles.header}>Hello, I am Scriber, your helpful app!</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/liveTranscription")}>
        <Text style={styles.buttonText}>Start Live Transcription</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/savedTranscriptions")}>
        <Text style={styles.secondaryButtonText}>View Saved Transcriptions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF", paddingHorizontal: 20 },
  navTitle: { fontSize: 18, fontWeight: "bold", color: "#B22222", marginBottom: 20 },
  header: { fontSize: 22, fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: 20 },
  button: { backgroundColor: "#B22222", paddingVertical: 14, paddingHorizontal: 30, borderRadius: 8, elevation: 3, marginBottom: 15 },
  secondaryButton: { backgroundColor: "#FFFFFF", paddingVertical: 14, paddingHorizontal: 30, borderRadius: 8, borderWidth: 2, borderColor: "#B22222" },
  buttonText: { fontSize: 16, color: "#FFFFFF", fontWeight: "bold" },
  secondaryButtonText: { fontSize: 16, color: "#B22222", fontWeight: "bold" },
});
