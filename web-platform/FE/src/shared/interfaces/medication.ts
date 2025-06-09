export interface Medication {
  name: string;
  dose: string;
  frequency: string;
  route: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
  notes?: string;
}
