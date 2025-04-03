// Import necessary dependencies for testing
import React from 'react';
// render: renders React components for testing
// fireEvent: simulates user interactions like pressing buttons
import { render, fireEvent, waitFor } from '@testing-library/react-native';
// NavigationContainer: wrapper component needed for testing navigation
import { NavigationContainer } from '@react-navigation/native';
// Import the main App component that we want to test
import App from '../app/index';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Mock the expo-router module
// This is necessary because expo-router is specific to Expo and won't work in the test environment
jest.mock('expo-router', () => ({
  // Mock the useRouter hook to return an object with navigation functions
  useRouter: () => ({
    push: jest.fn(),    // Mock function for navigation.push
    replace: jest.fn(), // Mock function for navigation.replace
    back: jest.fn(),    // Mock function for navigation.back
  }),
  // Mock the useLocalSearchParams hook to return an empty object
  useLocalSearchParams: () => ({}),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

// Test suite for the SignIn component
describe('SignIn Component', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test initial render
  it('renders the sign in form correctly', () => {
    const { getByText } = render(<App />);

    // Check if the title is present
    expect(getByText('FarmFlow')).toBeTruthy();
  });

  // Test form validation
  it('shows error message when submitting empty form', async () => {
    const { getByText, getByRole } = render(
      <NavigationContainer>
        <App />
      </NavigationContainer>
    );

    // Submit the form without entering credentials
    const submitButton = getByRole('button', { name: /sign in/i });
    fireEvent.press(submitButton);

    // Check for error message
    await waitFor(() => {
      expect(getByText('Please enter username and password.')).toBeTruthy();
    });
  });

  // Test successful login
  it('handles successful login correctly', async () => {
    // Mock successful API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-token' })
    });

    const { getByPlaceholderText, getByRole } = render(
      <NavigationContainer>
        <App />
      </NavigationContainer>
    );

    // Fill in the form
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByRole('button', { name: /sign in/i });

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'testpass');
    fireEvent.press(submitButton);

    // Check if API was called with correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api-token-auth/',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'testuser',
            password: 'testpass',
          }),
        })
      );
    });
  });

  // Test failed login
  it('shows error message on failed login', async () => {
    // Mock failed API response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ non_field_errors: ['Invalid credentials'] })
    });

    const { getByPlaceholderText, getByRole, getByText } = render(
      <NavigationContainer>
        <App />
      </NavigationContainer>
    );

    // Fill in the form
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByRole('button', { name: /sign in/i });

    fireEvent.changeText(usernameInput, 'wronguser');
    fireEvent.changeText(passwordInput, 'wrongpass');
    fireEvent.press(submitButton);

    // Check for error message
    await waitFor(() => {
      expect(getByText('Invalid credentials')).toBeTruthy();
    });
  });
});