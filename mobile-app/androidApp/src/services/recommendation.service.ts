import axios from 'axios';

const API_URL = 'https://d6b6-193-226-8-99.ngrok-free.app';

export interface Recommendation {
  id: number;
  patientId: number;
  activityType: string;
  dailyDuration: number;
  startDate: string;
  endDate: string;
  additionalNotes: string;
  isActive: boolean;
  hl7: any;
}

class RecommendationService {
  async getPatientRecommendations(): Promise<Recommendation[]> {
    try {
      // Fetch all recommendations and filter for patientId 1
      const response = await axios.get<Recommendation[]>(`${API_URL}/custom-recommendations`);
      const recommendations = response.data.filter(r => r.patientId === 1);
      console.log('Patient recommendations:', recommendations);
      return recommendations;
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