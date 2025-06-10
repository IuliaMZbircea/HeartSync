import {Referral} from "./referral";
import {Medication} from "./medication";
import {Consultation} from "./consultation";
import {Recommendation} from "./recommendation";
import {Alarm} from "./alarm";
import {Allergy} from "./allergies";
import {Disease} from "./disease";

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
  validAccount: boolean;
  birthDate?: string;
  sex?: 'M' | 'F';
  createdAt?: string;
  isActive: boolean;

  allergies?: Allergy[];
  alarms?: Alarm[];
  sensorAlertThresholds?: any[];

  consultations?: Consultation[];
  recommendations?: Recommendation[];
  medications?: Medication[];
  referrals?: Referral[];

  diseases?: Disease[];
}
