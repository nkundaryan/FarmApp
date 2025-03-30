import React, { useState } from 'react';
import { useRouter } from 'expo-router';

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333333",
  },
  input: {
    width: "100%",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#dddddd",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "16px",
    backgroundColor: "#ffffff",
    color: "#333333",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: "15px",
    borderRadius: "8px",
    border: "none",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  errorText: {
    color: "#f44336",
    marginBottom: "15px",
    fontSize: "14px",
    padding: "10px",
    backgroundColor: "#fee2e2",
    borderRadius: "6px",
  }
};

export default function NewGreenhouseScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    size: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setIsLoading(true);
      
      const token = localStorage.getItem('auth_token');
      console.log('Auth token:', token); // Debug log

      // Validate required fields
      if (!formData.name.trim()) {
        setError('Greenhouse name is required');
        return;
      }
      if (!formData.size.trim() || isNaN(Number(formData.size))) {
        setError('Size must be a valid number');
        return;
      }

      if (!token) {
        setError('Not authenticated. Please log in again.');
        router.replace('/');
        return;
      }

      const requestData = {
        name: formData.name.trim(),
        size: Number(formData.size),
      };
      console.log('Sending data:', requestData); // Debug log

      const response = await fetch('http://localhost:8000/greenhouses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status); // Debug log

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        console.error('Server error details:', errorData); // Debug log
        const errorMessage = typeof errorData === 'object' && errorData !== null
          ? Object.values(errorData as Record<string, string[]>)[0]?.[0]
          : 'Failed to create greenhouse';
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Network error:', err); // Debug log
      setError('Failed to create greenhouse. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create New Greenhouse</h1>
      
      {error && (
        <div style={styles.errorText}>{error}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          placeholder="Greenhouse Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        
        <input
          style={styles.input}
          type="number"
          placeholder="Size (sq ft)"
          value={formData.size}
          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
        />
        
        <button 
          type="submit"
          style={{
            ...styles.button,
            ...((!Object.values(formData).every(Boolean) || isLoading) ? styles.buttonDisabled : {})
          }}
          disabled={!Object.values(formData).every(Boolean) || isLoading}
        >
          {isLoading ? "Creating..." : "Create Greenhouse"}
        </button>
      </form>
    </div>
  );
} 