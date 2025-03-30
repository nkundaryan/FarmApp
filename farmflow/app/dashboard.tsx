import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  greenhouse_name: string;
}

interface Greenhouse {
  id: number;
  name: string;
  size: number;
}

interface Stats {
  total_greenhouses: number;
  total_tasks: number;
  tasks_completed: number;
  tasks_in_progress: number;
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
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333333",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  statCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center" as const,
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#507D2A",
    marginBottom: "8px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#666666",
  },
  section: {
    marginBottom: "40px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333333",
  },
  viewAllButton: {
    backgroundColor: "transparent",
    color: "#507D2A",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  greenhousesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  greenhouseCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "20px",
    cursor: "pointer",
    transition: "transform 0.2s",
    '&:hover': {
      transform: "scale(1.02)",
    },
  },
  greenhouseTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "8px",
  },
  greenhouseInfo: {
    fontSize: "14px",
    color: "#666666",
  },
  tasksList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  taskCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "15px",
    cursor: "pointer",
    transition: "transform 0.2s",
    '&:hover': {
      transform: "scale(1.01)",
    },
  },
  taskHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  taskTitle: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#333333",
  },
  taskMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#666666",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },
  statusPending: {
    backgroundColor: "#FFF3CD",
    color: "#856404",
  },
  statusInProgress: {
    backgroundColor: "#CCE5FF",
    color: "#004085",
  },
  statusCompleted: {
    backgroundColor: "#D4EDDA",
    color: "#155724",
  },
};

export default function DashboardScreen() {
  const [stats, setStats] = useState<Stats>({
    total_greenhouses: 0,
    total_tasks: 0,
    tasks_completed: 0,
    tasks_in_progress: 0,
  });
  const [recentGreenhouses, setRecentGreenhouses] = useState<Greenhouse[]>([]);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          window.location.href = '/';
          return;
        }

        // Fetch stats
        const statsResponse = await fetch('http://localhost:8000/api/stats/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        // Fetch recent greenhouses (limit to 4)
        const greenhousesResponse = await fetch('http://localhost:8000/api/greenhouses/?limit=4', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        // Fetch urgent tasks (limit to 5)
        const tasksResponse = await fetch('http://localhost:8000/api/tasks/?urgent=true&limit=5', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        if (greenhousesResponse.ok) {
          const greenhousesData = await greenhousesResponse.json();
          setRecentGreenhouses(greenhousesData);
        }

        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          setUrgentTasks(tasksData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusStyle = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'in_progress':
        return styles.statusInProgress;
      case 'completed':
        return styles.statusCompleted;
      default:
        return {};
    }
  };

  const navigateToGreenhouse = (id: number) => {
    window.location.href = `/greenhouse/${id}`;
  };

  const navigateToTask = (id: number) => {
    window.location.href = `/task/${id}`;
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <Navbar />
        <div style={styles.contentContainer}>
          <div style={styles.header}>
            <h1 style={styles.title}>Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <div style={styles.contentContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dashboard</h1>
        </div>

        {/* Stats Overview */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.total_greenhouses}</div>
            <div style={styles.statLabel}>Total Greenhouses</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.total_tasks}</div>
            <div style={styles.statLabel}>Total Tasks</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.tasks_in_progress}</div>
            <div style={styles.statLabel}>Tasks In Progress</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.tasks_completed}</div>
            <div style={styles.statLabel}>Tasks Completed</div>
          </div>
        </div>

        {/* Recent Greenhouses */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Greenhouses</h2>
            <button 
              style={styles.viewAllButton}
              onClick={() => window.location.href = '/greenhouses'}
            >
              View All →
            </button>
          </div>
          <div style={styles.greenhousesGrid}>
            {recentGreenhouses.map((greenhouse) => (
              <div
                key={greenhouse.id}
                style={styles.greenhouseCard}
                onClick={() => navigateToGreenhouse(greenhouse.id)}
              >
                <div style={styles.greenhouseTitle}>{greenhouse.name}</div>
                <div style={styles.greenhouseInfo}>
                  Size: {greenhouse.size} square meters
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Tasks */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Urgent Tasks</h2>
            <button 
              style={styles.viewAllButton}
              onClick={() => window.location.href = '/tasks'}
            >
              View All →
            </button>
          </div>
          <div style={styles.tasksList}>
            {urgentTasks.map((task) => (
              <div
                key={task.id}
                style={styles.taskCard}
                onClick={() => navigateToTask(task.id)}
              >
                <div style={styles.taskHeader}>
                  <div style={styles.taskTitle}>{task.title}</div>
                  <div style={{
                    ...styles.statusBadge,
                    ...getStatusStyle(task.status)
                  }}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
                <div style={styles.taskMeta}>
                  <span>{task.greenhouse_name}</span>
                  <span>Due: {formatDate(task.due_date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

