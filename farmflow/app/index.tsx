import React, { useState } from "react";
import { useRouter } from "expo-router";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "20px",
  },
  loginContainer: {
    width: "100%",
    maxWidth: "400px",
    textAlign: "center" as const,
  },
  appTitle: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#507D2A",
    marginBottom: "40px",
  },
  formContainer: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  formTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "30px",
  },
  errorMessage: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  inputField: {
    width: "100%",
    height: "50px",
    padding: "0 15px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  submitButton: {
    width: "100%",
    height: "50px",
    backgroundColor: "#507D2A",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  submitButtonDisabled: {
    backgroundColor: "#88AA6F",
    cursor: "not-allowed",
  }
};

export default function SignIn() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!username.trim() || !password.trim()) {
        setError("Please enter username and password.");
        return;
      }

      setIsLoading(true);
      setError("");

      const response = await fetch('http://localhost:8000/api-token-auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('auth_token', data.token);
        router.push("/dashboard");
      } else {
        setError(data.non_field_errors?.[0] || "Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginContainer}>
        <h1 style={styles.appTitle}>FarmFlow</h1>
        
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Sign In</h2>
          
          {error && <div style={styles.errorMessage}>{error}</div>}
          
          <form onSubmit={handleSignIn}>
            <div style={styles.inputGroup}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.inputField}
                autoComplete="username"
              />
            </div>

            <div style={styles.inputGroup}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputField}
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              style={{
                ...styles.submitButton,
                ...(isLoading ? styles.submitButtonDisabled : {})
              }}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
