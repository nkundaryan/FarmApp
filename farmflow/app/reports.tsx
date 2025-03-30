import React from 'react';
import { useRouter } from 'expo-router';
import Navbar from './components/Navbar';

const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333333",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  reportCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "20px",
    cursor: "pointer",
    transition: "transform 0.2s",
    '&:hover': {
      transform: "scale(1.02)",
    },
  },
  reportTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "10px",
  },
  reportDescription: {
    fontSize: "14px",
    color: "#666666",
    marginBottom: "15px",
  },
  viewButton: {
    backgroundColor: "#507D2A",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    width: "100%",
  },
  placeholder: {
    width: "100%",
    height: "150px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#666666",
    fontSize: "14px",
  },
};

const reports = [
  {
    id: 1,
    title: "Greenhouse Overview",
    description: "Summary of all greenhouses, including size, temperature, humidity, and harvest dates.",
    chartType: "Statistics & Table",
  },
  {
    id: 2,
    title: "Task Completion Rate",
    description: "Analysis of task completion rates over time.",
    chartType: "Line Graph",
  },
  {
    id: 3,
    title: "Task Distribution",
    description: "Distribution of tasks by status and greenhouse.",
    chartType: "Pie Chart",
  },
  {
    id: 4,
    title: "Greenhouse Efficiency",
    description: "Comparison of greenhouse performance metrics.",
    chartType: "Radar Chart",
  },
];

export default function ReportsScreen() {
  const router = useRouter();

  const handleViewReport = (id: number) => {
    router.push(`/report/${id}`);
  };

  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <div style={styles.contentContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>Reports</h1>
        </div>

        <div style={styles.grid}>
          {reports.map((report) => (
            <div key={report.id} style={styles.reportCard}>
              <div style={styles.reportTitle}>{report.title}</div>
              <div style={styles.placeholder}>
                {report.chartType}
              </div>
              <div style={styles.reportDescription}>{report.description}</div>
              <button
                style={styles.viewButton}
                onClick={() => handleViewReport(report.id)}
              >
                View Report
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 