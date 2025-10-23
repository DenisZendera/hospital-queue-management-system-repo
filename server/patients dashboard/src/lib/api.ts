// API Service for Patient Dashboard
// Connects to the backend server

// Auto-detect API URL based on how the app is accessed
// If VITE_API_URL is "auto", use the current hostname
// This allows the app to work on any WiFi network without reconfiguration
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  // If set to "auto", detect the hostname automatically
  if (envUrl === 'auto') {
    const hostname = window.location.hostname;
    return `http://${hostname}:5000`;
  }

  // Otherwise use the configured URL or default to localhost
  return envUrl || 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  error?: string;
}

interface User {
  id: string;
  email: string;
  patientId: string;
  userType: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface Appointment {
  id?: string;
  appointmentId?: number;
  appointment_id?: number;
  patientId: string;
  patientEmail: string;
  doctorId?: string;
  doctor?: {
    id?: number;
    name?: string;
    full_name?: string;
    email?: string;
    staffId?: string;
  };
  doctor_name?: string;
  department: string;
  departmentName?: string;
  department_name?: string;
  date: string;
  time: string;
  appointmentDate?: string;
  appointmentTime?: string;
  appointment_date?: string;
  appointment_time?: string;
  queueNumber?: number;
  queue_number?: number;
  symptoms: string;
  status: string;
  createdAt?: string;
}

// Helper function to get auth token
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Patient Authentication
export const patientAuth = {
  // Sign up new patient
  signup: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/patient/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.data) {
      // Store token and user info
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data;
  },

  // Login patient
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/patient/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.data) {
      // Store token and user info
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data;
  },

  // Logout
  logout: async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.userId) {
          // Call backend logout endpoint to set is_online = 0
          await fetch(`${API_BASE_URL}/api/auth/patient/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ userId: user.userId })
          });
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getToken();
  },

  // Verify token
  verify: async (): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/patient/verify`, {
      headers: getAuthHeaders(),
    });

    return await response.json();
  },
};

// Appointments API
export const appointments = {
  // Book new appointment
  book: async (appointmentData: {
    department: string;
    symptoms: string;
    appointmentDate?: string;
    doctorId?: string;
    date?: string;
    time?: string;
  }): Promise<ApiResponse<Appointment>> => {
    const user = patientAuth.getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: 'User not authenticated',
      };
    }

    // Generate next available appointment date/time if not provided
    const nextTuesday = new Date();
    nextTuesday.setDate(nextTuesday.getDate() + ((2 + 7 - nextTuesday.getDay()) % 7 || 7));

    // Prepare the request body with proper field names
    const requestBody = {
      department: appointmentData.department, // Can be department ID or name
      symptoms: appointmentData.symptoms,
      appointmentDate: appointmentData.appointmentDate || appointmentData.date || nextTuesday.toISOString().split('T')[0],
      appointmentTime: appointmentData.time || null,
      preferredDoctorId: appointmentData.doctorId ? parseInt(appointmentData.doctorId) : null,
    };

    console.log('📤 Booking appointment with data:', requestBody);

    const response = await fetch(`${API_BASE_URL}/api/appointments/book`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    console.log('📥 Booking response:', result);

    return result;
  },

  // Get patient appointments
  getPatientAppointments: async (patientId: string): Promise<ApiResponse<Appointment[]>> => {
    const response = await fetch(`${API_BASE_URL}/api/appointments/patient/${patientId}`, {
      headers: getAuthHeaders(),
    });

    return await response.json();
  },

  // Cancel appointment
  cancel: async (appointmentId: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    return await response.json();
  },
};

// Health check
export const healthCheck = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Cannot connect to server',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Generic API methods
export const api = {
  get: async (endpoint: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await response.json();
  },

  post: async (endpoint: string, data: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  put: async (endpoint: string, data: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  patch: async (endpoint: string, data: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  delete: async (endpoint: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await response.json();
  },
};

export default {
  patientAuth,
  appointments,
  healthCheck,
  api,
};
