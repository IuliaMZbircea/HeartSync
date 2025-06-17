import { Platform } from 'react-native';

// Base API URL configuration
const DEV_API_URL = 'https://3cb8-2a02-2f09-3315-ed00-49cd-75b1-83fa-1bcc.ngrok-free.app';
const PROD_API_URL = 'https://your-production-api.com';

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

// API endpoints configuration
export const API_ENDPOINTS = {
  // Patient endpoints
  PATIENTS: {
    BASE: '/custom-patients',
    BY_ID: (id: number) => `/custom-patients/${id}`,
  },

  // Medication endpoints
  MEDICATIONS: {
    BASE: '/custom-medications',
    BY_PATIENT: (patientId: number) => `/custom-medications/patient_id/${patientId}`,
    BY_ID: (id: number) => `/custom-medications/${id}`,
  },
  
  // Recommendation endpoints
  RECOMMENDATIONS: {
    BASE: '/custom-recommendations',
    BY_PATIENT: (patientId: number) => `/custom-recommendations/patient_id/${patientId}`,
    BY_ID: (id: number) => `/custom-recommendations/${id}`,
  },
  
  // Pulse endpoints
  PULSE: {
    BASE: '/pulse',
    BY_PATIENT: (patientId: number) => `/pulse/${patientId}`,
  },
  
  // Alarms endpoints
  ALARMS: {
    BASE: '/custom-alarms',
    BY_ID: (id: number) => `/custom-alarms/${id}`,
    CREATE: '/custom-alarms',
  },
};

// API configuration
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

// Error messages
export const API_ERRORS = {
  NETWORK: 'Network error. Please check your internet connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  SERVER: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please log in again.',
  NOT_FOUND: 'Resource not found.',
}; 