// API Configuration
// Uses Vite environment variable VITE_API_BASE_URL when available (set in .env),
// otherwise falls back to the local development backend.

// Auto-detect API URL based on how the app is accessed
// If VITE_API_BASE_URL is "auto", use the current hostname
// This allows the app to work on any WiFi network without reconfiguration
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  // If set to "auto", detect the hostname automatically
  if (envUrl === 'auto') {
    const hostname = window.location.hostname;
    return `http://${hostname}:5000`;
  }

  // Otherwise use the configured URL or default to localhost
  return envUrl || 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('staffToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper function to make authenticated requests
export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    },
    credentials: 'include'
  });

  return response.json();
};
