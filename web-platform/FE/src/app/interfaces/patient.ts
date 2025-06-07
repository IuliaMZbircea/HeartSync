import {Consultation} from "./consultation";
import {Recommendation} from "./recommendation";
import {Alarm} from "./alarm";
import {Allergy} from "./allergies";
import {Medication} from "./medication";
import {MedicalLetter} from "./medicalLetter";
import {Referral} from "./referral";

export interface Disease {
  name: string;
  type: string;
  description: string;
}

export interface Patient {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  cnp: string;
  occupation: string;
  locality: string;
  street: string;
  number: string;
  block?: string;
  staircase?: string;
  apartment?: number;
  floor?: number;
  bloodGroup: string;
  rh: string;
  weight: number;
  height: number;
  allergies?: Allergy;
  validAccount:Boolean;
  diseases: Disease[];
  birthDate?: Date;
  sex?: 'M' | 'F';
  consultations?: Consultation[];
  recommendations?: Recommendation[];
  alarms?: Alarm[];
  medications?: Medication[];
  referrals?: Referral[];
}
