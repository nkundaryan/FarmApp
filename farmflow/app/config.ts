const DEV_API_URL = 'http://127.0.0.1:8000';
// Replace with your EC2 instance's public IP or domain
const PROD_API_URL = 'http://YOUR_EC2_PUBLIC_IP:8000';  // Example: 'http://54.123.45.67:8000'

// You can change this based on your environment
const isDevelopment = __DEV__;

export const API_URL = isDevelopment ? DEV_API_URL : PROD_API_URL; 