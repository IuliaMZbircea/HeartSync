import {Medication} from "./medication";
import {Disease} from "./disease";

export interface Consultation {
  id: number;
  dateTime: Date;
  doctorName: string;
  durationMinutes: number;

  symptoms: string;
  currentMedication: Medication[];
  medicalHistory: Disease[];
  familyHistory: string;

  pulse?: number;
  bloodPressure?: string;
  temperature?: number;
  weightKg?: number;
  heightCm?: number;
  respiratoryRate?: number;
  notes?: string;

  diagnosis: Disease[];

  referralIds?: number[];
  prescriptionIds?: number[];
}
