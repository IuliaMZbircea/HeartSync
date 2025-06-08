export interface Allergy {
  name: string;
  severity?: 'low' | 'medium' | 'high';
  reaction?: string;
  notes?: string;
  recordedDate ?: Date;
  active?: true;
}
