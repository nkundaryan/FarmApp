import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';

interface Greenhouse {
  id: number;
  name: string;
  size: number;
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "20px",
    cursor: "pointer",
    transition: "transform 0.2s",
    '&:hover': {
      transform: "scale(1.02)",
    },
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "10px",
  },
  cardInfo: {
    fontSize: "14px",
    color: "#666666",
  },
  noGreenhouses: {
    textAlign: "center" as const,
    color: "#666666",
    marginTop: "50px",
    fontSize: "18px",
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '500px',
    position: 'relative' as const,
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px',
  },
  label: {
    fontSize: '14px',
    color: '#666666',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  cancelButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#ffffff',
    color: '#666666',
    cursor: 'pointer',
    fontSize: '14px',
  },
  submitButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#507D2A',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '5px',
  },
};

export default function GreenhousesScreen() {
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    size: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchGreenhouses = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        window.location.href = '/';
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
      console.error('Error fetching greenhouses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGreenhouses();
  }, []);

  const handleAddGreenhouse = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: '', size: '' });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        setError('Name is required');
        return;
      }
      if (!formData.size.trim() || isNaN(Number(formData.size)) || Number(formData.size) <= 0) {
        setError('Size must be a positive number');
        return;
      }

      const token = localStorage.getItem('auth_token');
      if (!token) {
        window.location.href = '/';
        return;
      }

      const response = await fetch('http://localhost:8000/greenhouses/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          size: Number(formData.size),
        }),
      });

      if (response.ok) {
        const newGreenhouse = await response.json();
        setGreenhouses([...greenhouses, newGreenhouse]);
        handleCloseModal();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create greenhouse');
      }
    } catch (error) {
      console.error('Error creating greenhouse:', error);
      setError('Failed to create greenhouse. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGreenhouseClick = (id: number) => {
    window.location.href = `/greenhouse/${id}`;
  };

  return (
    <div style={styles.pageContainer}>
      <Navbar />
      <div style={styles.contentContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>Greenhouses</h1>
          <button 
            style={styles.addButton}
            onClick={handleAddGreenhouse}
          >
            Add Greenhouse
          </button>
        </div>

        {loading ? (
          <div style={styles.noGreenhouses}>Loading...</div>
        ) : greenhouses.length > 0 ? (
          <div style={styles.grid}>
            {greenhouses.map((greenhouse) => (
              <div
                key={greenhouse.id}
                style={styles.card}
                onClick={() => handleGreenhouseClick(greenhouse.id)}
              >
                <div style={styles.cardTitle}>{greenhouse.name}</div>
                <div style={styles.cardInfo}>
                  Size: {greenhouse.size} square meters
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noGreenhouses}>
            No greenhouses found. Click "Add Greenhouse" to create one.
          </div>
        )}

        {/* Add Greenhouse Modal */}
        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h2 style={styles.modalTitle}>Add New Greenhouse</h2>
              <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    style={styles.input}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter greenhouse name"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="size">Size (square meters)</label>
                  <input
                    id="size"
                    type="number"
                    style={styles.input}
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="Enter size"
                    min="1"
                  />
                </div>
                {error && <div style={styles.errorText}>{error}</div>}
                <div style={styles.buttonGroup}>
                  <button
                    type="button"
                    style={styles.cancelButton}
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Greenhouse'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 