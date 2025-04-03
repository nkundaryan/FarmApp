import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { StatsCard } from './components/dashboard/StatsCard';
import { GreenhouseCard } from './components/dashboard/GreenhouseCard';
import { TaskCard } from './components/dashboard/TaskCard';
import { SectionHeader } from './components/dashboard/SectionHeader';

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
        // Simulated data for now
        setStats({
          total_greenhouses: 5,
          total_tasks: 12,
          tasks_completed: 8,
          tasks_in_progress: 4,
        });
        setRecentGreenhouses([
          { id: 1, name: 'Main Greenhouse', size: 1000 },
          { id: 2, name: 'Herb Garden', size: 500 },
          { id: 3, name: 'Seedling Room', size: 300 },
        ]);
        setUrgentTasks([
          { id: 1, title: 'Water plants', status: 'pending', due_date: '2024-04-03', greenhouse_name: 'Main Greenhouse' },
          { id: 2, title: 'Check temperature', status: 'in_progress', due_date: '2024-04-03', greenhouse_name: 'Herb Garden' },
        ]);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.statsGrid}>
          <StatsCard value={stats.total_greenhouses} label="Total Greenhouses" color="#2ECC71" />
          <StatsCard value={stats.total_tasks} label="Total Tasks" color="#3498DB" />
          <StatsCard value={stats.tasks_completed} label="Completed Tasks" color="#2ECC71" />
          <StatsCard value={stats.tasks_in_progress} label="In Progress" color="#F1C40F" />
        </View>

        <SectionHeader title="Recent Greenhouses" onViewAll={() => {}} />
        <View style={styles.greenhousesGrid}>
          {recentGreenhouses.map((greenhouse) => (
            <GreenhouseCard
              key={greenhouse.id}
              name={greenhouse.name}
              size={greenhouse.size}
              onPress={() => {}}
            />
          ))}
        </View>

        <SectionHeader title="Urgent Tasks" onViewAll={() => {}} />
        <View style={styles.tasksList}>
          {urgentTasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              status={task.status}
              dueDate={formatDate(task.due_date)}
              onPress={() => {}}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  greenhousesGrid: {
    marginBottom: 24,
  },
  tasksList: {
    marginBottom: 24,
  },
});

