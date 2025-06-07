export interface Consultation {
  id: number;
  date: Date;
  reason: string;
  symptoms: string;
  diagnosisICD10: string;
  doctorName: string;
  notes?: string;
}
