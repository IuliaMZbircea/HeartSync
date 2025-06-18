import axios from 'axios';

const API_URL = 'https://d6b6-193-226-8-99.ngrok-free.app';

export interface PatientAlarm {
  id: number;
  parameter: string;
  condition: string;
  threshold: number;
  duration: number;
  afterActivity: boolean;
  message: string;
}

export interface PatientAllergy {
  id: number;
  name: string;
  severity: string;
  reaction: string;
  notes: string;
  recordedDate: string;
}

export interface PatientDisease {
  id: number;
  name: string;
  type: string;
  description: string;
}

export interface PatientMedication {
  id: number;
  name: string;
  dose: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate: string | null;
  prescribedBy: string;
  notes: string;
  createdAt: string;
  isActive: boolean;
}

export interface Patient {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  cnp: string;
  occupation: string;
  locality: string;
  street: string;
  number: string;
  block: string | null;
  staircase: string | null;
  apartment: number | null;
  floor: number | null;
  bloodGroup: string;
  rh: string;
  weight: number;
  height: number;
  birthDate: string | null;
  sex: string | null;
  createdAt: string;
  isActive: boolean;
  alarms: PatientAlarm[];
  allergies: PatientAllergy[];
  diseases: PatientDisease[];
  medications: PatientMedication[];
  consultations: any[];
  referrals: any[];
  recommendations: any[];
  sensorAlertThresholds: any[];
}

class PatientService {
  async getPatientDetails(): Promise<Patient> {
    try {
      // Get all patients and find patient with ID 1
      const response = await axios.get<Patient[]>(`${API_URL}/custom-patients`);
      console.log('All patients:', response.data);
      
      const patient = response.data.find(p => p.id === 1);
      if (!patient) {
        throw new Error('Patient with ID 1 not found');
      }
      
      console.log('Patient details:', patient);
      return patient;
    } catch (error: any) {
      console.error('Error fetching patient details:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new PatientService(); 