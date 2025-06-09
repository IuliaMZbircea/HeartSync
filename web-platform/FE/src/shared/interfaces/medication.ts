export interface Medication {
  id: number;
  name: string;
  dose: string;
  frequency: string;
  route: string;
  startDate: Date | string;
  endDate: Date | string;
  prescribedBy: string;
  notes?: string;
  isActive: boolean;
  createdAt?: Date | string;
  patient: number;
}
