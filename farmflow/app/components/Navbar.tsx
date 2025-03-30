import React from 'react';
import { useRouter } from 'expo-router';

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    color: '#507D2A',
    marginRight: '40px',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  navSection: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  navButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: '#333333',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  activeNavButton: {
    backgroundColor: '#f0f7ed',
    color: '#507D2A',
    fontWeight: 'bold' as const,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#f44336',
    border: 'none',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#d32f2f',
    },
  },
};

export default function Navbar() {
  const router = useRouter();
  const [activePage, setActivePage] = React.useState('/dashboard');

  const handleNavigation = (path: string) => {
    setActivePage(path);
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.replace('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Greenhouses', path: '/greenhouses' },
    { label: 'Tasks', path: '/tasks' },
    { label: 'Reports', path: '/reports' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoSection}>
        <span 
          style={styles.logo}
          onClick={() => handleNavigation('/dashboard')}
        >
          FarmFlow
        </span>
        <div style={styles.navSection}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              style={{
                ...styles.navButton,
                ...(activePage === item.path ? styles.activeNavButton : {}),
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      
      <div style={styles.userSection}>
        <button
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </button>
      </div>
    </nav>
  );
} 