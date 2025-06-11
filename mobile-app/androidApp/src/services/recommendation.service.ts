import axios from 'axios';

const API_URL = 'https://1234-2a02-2f09-3315-ed00-74a3-304e-8145-9ebf.ngrok-free.app';

export interface Recommendation {
  id: number;
  patientId: number;
  type: string;
  description: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'cancelled';
  followUpDate?: string;
}

class RecommendationService {
  async getPatientRecommendations(): Promise<Recommendation[]> {
    try {
      // Always fetch recommendations for patient ID 1
      const response = await axios.get<Recommendation[]>(`${API_URL}/custom-recommendations?patient_id=1`);
      console.log('Patient recommendations:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching recommendations:', error.response?.data || error.message);
      throw error;
    }
  }

  async addRecommendation(recommendation: Omit<Recommendation, 'id'>): Promise<Recommendation> {
    try {
      const recommendationWithPatientId = {
        ...recommendation,
        patientId: 1 // Always set patient ID to 1
      };
      const response = await axios.post(`${API_URL}/custom-recommendations`, recommendationWithPatientId);
      return response.data;
    } catch (error: any) {
      console.error('Error adding recommendation:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new RecommendationService(); 