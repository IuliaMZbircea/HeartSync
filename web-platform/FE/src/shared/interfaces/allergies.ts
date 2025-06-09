export interface Allergy {
  id?: number;
  name: string;
  severity?: 'low' | 'medium' | 'high';
  reaction?: string;
  notes?: string;
  recordedDate?: string;
  createdAt?: string;
  patient?: number;
  isActive?: boolean;
}
