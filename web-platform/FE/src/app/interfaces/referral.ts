export type ReferralType =
  | 'FAMILY_TO_SPECIALIST'
  | 'SPECIALIST_TO_ANALYSIS'
  | 'SPECIALIST_TO_HOSPITAL'
  | 'SPECIALIST_TO_TREATMENT'
  | 'SPECIALIST_TO_PROCEDURE';

export interface Referral {
  id: number;
  type: ReferralType;

  patientId: number;

  fromDoctorId: number;
  toDoctorId: number;

  reason: string;
  date: Date;

  hl7Payload?: string;
  fhirResponseId?: number;

  isResolved: boolean;
}
