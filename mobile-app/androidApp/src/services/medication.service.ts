import axios from 'axios';

const API_URL = 'https://d6b6-193-226-8-99.ngrok-free.app';

export interface MedicationRequest {
  resourceType: 'MedicationRequest';
  id: number;
  status: 'active' | 'completed' | 'stopped' | 'cancelled';
  prescribedBy: string;
  subject: {
    reference: string;
  };
  medicationCodeableConcept: {
    text: string;
  };
  dosageInstruction: Array<{
    text: string;
  }>;
  route: {
    text: string;
  };
  note: Array<{
    text: string;
  }>;
  authoredOn: string;
  extension: Array<{
    url: string;
    valueString: string;
  }>;
}

class MedicationService {
  async getPatientMedications(): Promise<MedicationRequest[]> {
    try {
      // Get all medications and filter for patient ID 1
      const response = await axios.get<MedicationRequest[]>(`${API_URL}/custom-medications`);
      console.log('All medications:', response.data);
      
      // Filter medications for patient 1
      const patientMedications = response.data.filter(
        med => med.subject.reference === '/api/patients/1'
      );
      
      console.log('Patient 1 medications:', patientMedications);
      return patientMedications;
    } catch (error: any) {
      console.error('Error fetching medications:', error.response?.data || error.message);
      throw error;
    }
  }

  async addMedication(medication: Omit<MedicationRequest, 'id'>): Promise<MedicationRequest> {
    try {
      const medicationWithPatient = {
        ...medication,
        subject: {
          reference: '/api/patients/1'
        }
      };
      const response = await axios.post(`${API_URL}/custom-medications`, medicationWithPatient);
      return response.data;
    } catch (error: any) {
      console.error('Error adding medication:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new MedicationService(); 