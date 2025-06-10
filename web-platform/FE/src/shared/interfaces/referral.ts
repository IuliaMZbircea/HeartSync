import {Doctor} from "./doctor";

export type ReferralType =
  | 'FAMILY_TO_SPECIALIST'
  | 'SPECIALIST_TO_ANALYSIS'
  | 'SPECIALIST_TO_HOSPITAL'
  | 'SPECIALIST_TO_TREATMENT'
  | 'SPECIALIST_TO_PROCEDURE';

export interface Referral {
  id: number;
  type: string;
  reason: string;
  date: string;
  fromDoctor: { id: number; firstName: string; lastName: string };
  toDoctor?: { id: number; firstName: string; lastName: string };
  isResolved: boolean;
  isActive: boolean;
  hl7Payload?: string;
  fhirResponseId?: string;
  createdAt?: string;
}
