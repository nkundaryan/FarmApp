const DEV_API_URL = 'http://127.0.0.1:8000';
const PROD_API_URL = 'http://13.57.38.117:8000';  // EC2 instance URL

// Set to false when deploying to EC2
const isDevelopment = false;

export const API_URL = isDevelopment ? DEV_API_URL : PROD_API_URL; 