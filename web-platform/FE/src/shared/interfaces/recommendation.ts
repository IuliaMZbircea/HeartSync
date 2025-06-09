export interface Recommendation {
  id: number;
  patientId: number;
  activityType: string;
  dailyDuration: number;
  startDate: string;
  endDate?: string;
  additionalNotes?: string;
  isActive: boolean;
  createdAt?: string;
}
