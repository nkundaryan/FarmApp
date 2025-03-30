import React from 'react';
import Navbar from './components/Navbar';

const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "30px",
  },
  section: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "15px",
  },
  settingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  settingLabel: {
    fontSize: "16px",
    color: "#333333",
  },
  settingDescription: {
    fontSize: "14px",
    color: "#666666",
    marginTop: "4px",
  },
  toggle: {
    width: "50px",
    height: "24px",
    backgroundColor: "#ccc",
    borderRadius: "12px",
    padding: "2px",
    cursor: "pointer",
    position: "relative" as const,
  },
  toggleActive: {
    backgroundColor: "#4CAF50",
  },
  toggleHandle: {
    width: "20px",
    height: "20px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    transition: "transform 0.2s",
  },
  toggleHandleActive: {
    transform: "translateX(26px)",
  },
  button: {
    backgroundColor: "#507D2A",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
};

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <div style={styles.contentContainer}>
        <h1 style={styles.title}>Settings</h1>
        
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Notifications</h2>
          <div style={styles.settingRow}>
            <div>
              <div style={styles.settingLabel}>Push Notifications</div>
              <div style={styles.settingDescription}>
                Receive alerts about important greenhouse events
              </div>
            </div>
            <div 
              style={{
                ...styles.toggle,
                ...(notifications ? styles.toggleActive : {})
              }}
              onClick={() => setNotifications(!notifications)}
            >
              <div 
                style={{
                  ...styles.toggleHandle,
                  ...(notifications ? styles.toggleHandleActive : {})
                }}
              />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Appearance</h2>
          <div style={styles.settingRow}>
            <div>
              <div style={styles.settingLabel}>Dark Mode</div>
              <div style={styles.settingDescription}>
                Switch between light and dark theme
              </div>
            </div>
            <div 
              style={{
                ...styles.toggle,
                ...(darkMode ? styles.toggleActive : {})
              }}
              onClick={() => setDarkMode(!darkMode)}
            >
              <div 
                style={{
                  ...styles.toggleHandle,
                  ...(darkMode ? styles.toggleHandleActive : {})
                }}
              />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Account</h2>
          <div style={styles.settingRow}>
            <div>
              <div style={styles.settingLabel}>Update Profile</div>
              <div style={styles.settingDescription}>
                Change your account information
              </div>
            </div>
            <button style={styles.button}>Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
} 