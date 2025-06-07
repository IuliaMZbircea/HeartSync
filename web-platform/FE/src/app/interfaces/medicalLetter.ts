export interface MedicalLetter {
  id: number;
  referralId: number;
  patientId: number;
  fromSpecialistId: number;
  toDoctorId: number;
  consultationId?: number;
  date: Date;
  fhirPayload: string;
}
