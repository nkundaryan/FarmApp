import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Navbar from '../components/Navbar';

interface Greenhouse {
  id: number;
  name: string;
  location: string;
  size: number;
  temperature: number;
  humidity: number;
  next_harvest_date: string;
}

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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333333",
  },
  backButton: {
    padding: "8px 16px",
    backgroundColor: "#507D2A",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  reportSection: {
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    overflow: "hidden",
  },
  th: {
    backgroundColor: "#507D2A",
    color: "#ffffff",
    padding: "12px",
    textAlign: "left" as const,
    fontWeight: "bold",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #e0e0e0",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "6px",
    marginTop: "20px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  statCard: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "6px",
    textAlign: "center" as const,
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#507D2A",
    marginBottom: "5px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#666666",
  },
};

export default function ReportDetail() {
  const router = useRouter();
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGreenhouses = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          router.replace('/');
          return;
        }

        const response = await fetch('http://localhost:8000/greenhouses/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setGreenhouses(data);
        } else {
          console.error('Failed to fetch greenhouses');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGreenhouses();
  }, []);

  const calculateStats = () => {
    if (greenhouses.length === 0) return null;

    const totalSize = greenhouses.reduce((sum, gh) => sum + Number(gh.size), 0);
    const avgTemp = greenhouses.reduce((sum, gh) => sum + Number(gh.temperature), 0) / greenhouses.length;
    const avgHumidity = greenhouses.reduce((sum, gh) => sum + Number(gh.humidity), 0) / greenhouses.length;

    return {
      totalGreenhouses: greenhouses.length,
      totalSize: Number(totalSize).toFixed(1),
      averageTemp: Number(avgTemp).toFixed(1),
      averageHumidity: Number(avgHumidity).toFixed(1),
    };
  };

  const stats = calculateStats();

  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <div style={styles.contentContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>Greenhouse Report</h1>
          <button 
            style={styles.backButton}
            onClick={() => router.push('/reports')}
          >
            Back to Reports
          </button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div style={styles.reportSection}>
              <h2 style={styles.sectionTitle}>Overview Statistics</h2>
              {stats && (
                <div style={styles.statsGrid}>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.totalGreenhouses}</div>
                    <div style={styles.statLabel}>Total Greenhouses</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.totalSize}m²</div>
                    <div style={styles.statLabel}>Total Area</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.averageTemp}°C</div>
                    <div style={styles.statLabel}>Average Temperature</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.averageHumidity}%</div>
                    <div style={styles.statLabel}>Average Humidity</div>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.reportSection}>
              <h2 style={styles.sectionTitle}>Detailed Greenhouse Data</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Size (m²)</th>
                    <th style={styles.th}>Temperature (°C)</th>
                    <th style={styles.th}>Humidity (%)</th>
                    <th style={styles.th}>Next Harvest</th>
                  </tr>
                </thead>
                <tbody>
                  {greenhouses.map((greenhouse) => (
                    <tr key={greenhouse.id}>
                      <td style={styles.td}>{greenhouse.name}</td>
                      <td style={styles.td}>{greenhouse.location}</td>
                      <td style={styles.td}>{greenhouse.size}</td>
                      <td style={styles.td}>{greenhouse.temperature}°C</td>
                      <td style={styles.td}>{greenhouse.humidity}%</td>
                      <td style={styles.td}>
                        {new Date(greenhouse.next_harvest_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 