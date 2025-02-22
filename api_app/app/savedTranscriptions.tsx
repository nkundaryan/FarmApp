import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SavedTranscriptions() {
  const router = useRouter();

  // Fake data for saved transcriptions
  const [transcriptions, setTranscriptions] = useState([
    { id: "1", title: "Dr.Nkunda: Knee Pain", date: "Feb 20, 2025" },
    { id: "2", title: "Dr.Smith: Left Ankle", date: "Feb 18, 2025" },
    { id: "3", title: "Dr.Nkunda: ", date: "Feb 15, 2025" },
    { id: "4", title: "VDr.Nkunda: Knee Pain", date: "Feb 12, 2025" },
    { id: "5", title: "WDr.Nkunda: Knee Pain", date: "Feb 10, 2025" },
  ]);

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Special Olympics</Text>
      </View>

      {/* Floating Box for Saved Transcriptions */}
      <View style={styles.contentBox}>
        <Text style={styles.header}>Saved Transcriptions</Text>

        {/* List of Transcriptions */}
        <FlatList
          data={transcriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.transcriptionRow}>
              {/* View Button */}
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>

              {/* Transcription Info */}
              <View style={styles.textContainer}>
                <Text style={styles.transcriptionTitle}>{item.title}</Text>
                <Text style={styles.transcriptionDate}>{item.date}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/transcribe")}>
          <Text style={styles.buttonText}>Back to Transcribe</Text>
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
    paddingHorizontal: 20,
  },
  navBar: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  navTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#B22222",
  },
  contentBox: {
    flex: 1,
    width: "95%",
    maxWidth: 600,
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 30, // Rounded edges
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "stretch",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  listContainer: {
    width: "100%",
    paddingVertical: 10,
  },
  transcriptionRow: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#F9F9F9",
    paddingVertical: 14,
    paddingHorizontal: 15,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: "100%",
  },
  viewButton: {
    backgroundColor: "#B22222", // Special Olympics Red
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 12,
  },
  viewButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1, // Makes text take full space
  },
  transcriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  transcriptionDate: {
    fontSize: 12,
    color: "#777",
  },
  backButton: {
    backgroundColor: "#B22222",
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
