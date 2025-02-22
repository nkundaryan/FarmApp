import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

export default function LiveTranscription() {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptions, setTranscriptions] = useState([
    { id: "1", speaker: "Speaker 1", text: "Hello, how are you?" },
    { id: "2", speaker: "Speaker 2", text: "I’m good! What about you?" },
    { id: "3", speaker: "Speaker 1", text: "Doing well, thanks for asking." },
    { id: "4", speaker: "Speaker 2", text: "Great to hear!" },
  ]);

  const handleStop = () => {
    setIsTranscribing(false);
  };

  const handleEnd = () => {
    setIsTranscribing(false);
    setTranscriptions([]);
  };

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Special Olympics</Text>
      </View>

      {/* Full-Screen Context Box */}
      <View style={styles.contentBox}>
        <Text style={styles.liveHeader}>LIVE TRANSCRIPTION</Text>

        {/* Scrollable Live Transcription */}
        <ScrollView style={styles.transcriptionBox}>
          {transcriptions.map((item) => (
            <View
              key={item.id}
              style={[
                styles.transcriptionRow,
                item.speaker === "Speaker 1" ? styles.speaker1Row : styles.speaker2Row,
              ]}
            >
              <View
                style={[
                  styles.speechBubble,
                  item.speaker === "Speaker 1" ? styles.speaker1Bubble : styles.speaker2Bubble,
                ]}
              >
                <Text style={styles.speakerLabel}>{item.speaker}</Text>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Stop and End Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
            <Text style={styles.buttonText}>STOP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.endButton} onPress={handleEnd}>
            <Text style={styles.buttonText}>END</Text>
          </TouchableOpacity>
        </View>
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
    flex: 1, // Takes full screen
    width: "95%",
    maxWidth: 600, // Allows resizing for tablets
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 30, // **Rounded corners**
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Android shadow effect
    alignItems: "center",
  },
  liveHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  transcriptionBox: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F9F9F9",
    borderRadius: 20, // Rounded edges inside
    padding: 20,
    marginBottom: 20,
  },
  transcriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  speaker1Row: {
    justifyContent: "flex-start",
  },
  speaker2Row: {
    justifyContent: "flex-end",
  },
  speechBubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  speaker1Bubble: {
    backgroundColor: "#D1E8D1",
    alignSelf: "flex-start",
  },
  speaker2Bubble: {
    backgroundColor: "#F4B4B4",
    alignSelf: "flex-end",
  },
  speakerLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 3,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  stopButton: {
    backgroundColor: "#B22222",
    flex: 1,
    marginRight: 12,
    paddingVertical: 18,
    borderRadius: 15, // Rounded buttons
    alignItems: "center",
  },
  endButton: {
    backgroundColor: "#B22222",
    flex: 1,
    paddingVertical: 18,
    borderRadius: 15, // Rounded buttons
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
