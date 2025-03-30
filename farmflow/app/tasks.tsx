import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  greenhouse_id: number;
  greenhouse_name: string;
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333333",
  },
  addButton: {
    backgroundColor: "#507D2A",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  taskList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  taskCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "5px",
  },
  taskDescription: {
    fontSize: "14px",
    color: "#666666",
    marginBottom: "10px",
  },
  taskMeta: {
    display: "flex",
    gap: "20px",
    fontSize: "14px",
    color: "#666666",
  },
  statusBadge: {
    padding: "5px 10px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
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
  noTasks: {
    textAlign: "center" as const,
    color: "#666666",
    marginTop: "50px",
    fontSize: "18px",
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
  },
  actionButton: {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#4A90E2",
    color: "#ffffff",
  },
  deleteButton: {
    backgroundColor: "#DC3545",
    color: "#ffffff",
  },
};

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          window.location.href = '/';
          return;
        }

        const response = await fetch('http://localhost:8000/api/tasks/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAddTask = () => {
    window.location.href = '/task/new';
  };

  const handleEditTask = (id: number) => {
    window.location.href = `/task/${id}/edit`;
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/tasks/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== id));
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <div style={styles.contentContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>Tasks</h1>
          <button 
            style={styles.addButton}
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </div>

        {loading ? (
          <div style={styles.noTasks}>Loading...</div>
        ) : tasks.length > 0 ? (
          <div style={styles.taskList}>
            {tasks.map((task) => (
              <div key={task.id} style={styles.taskCard}>
                <div style={styles.taskInfo}>
                  <div style={styles.taskTitle}>{task.title}</div>
                  <div style={styles.taskDescription}>{task.description}</div>
                  <div style={styles.taskMeta}>
                    <span>Greenhouse: {task.greenhouse_name}</span>
                    <span>Due: {formatDate(task.due_date)}</span>
                    <span style={{
                      ...styles.statusBadge,
                      ...getStatusStyle(task.status)
                    }}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <div style={styles.actionButtons}>
                  <button
                    style={{...styles.actionButton, ...styles.editButton}}
                    onClick={() => handleEditTask(task.id)}
                  >
                    Edit
                  </button>
                  <button
                    style={{...styles.actionButton, ...styles.deleteButton}}
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noTasks}>
            No tasks found. Click "Add Task" to create one.
          </div>
        )}
      </div>
    </div>
  );
} 