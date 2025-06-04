import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { Patient } from "../interfaces/patient";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor() { }

  patient: Patient[] = [
    { id: 1,
      email: 'ana.popescu@example.com',
      phone: '0722123456',
      firstName: 'Ana',
      lastName: 'Popescu',
      cnp: '2980525123456',
      occupation: 'Medic',
      locality: 'Cluj-Napoca',
      street: 'Strada Primaverii',
      number: '12',
      block: 'B1',
      staircase: '2',
      apartment: 5,
      floor: 1,
      bloodGroup: 'A',
      rh: '+',
      weight: 58.5,
      height: 165,
      allergies: 'Polen, penicilină',
      validAccount: true,
      diseases: [
        {
          name: 'Hipertensiune arterială',
          type: 'chronic',
          description: 'Tensiune arterială ridicată observată în ultimii 2 ani'
        },
        {
          name: 'Astm',
          type: 'chronic',
          description: 'Astm bronșic diagnosticat în copilărie'
        }
      ],
      birthDate: new Date('1998-05-25'),
      sex: 'F',
      consultations: [
        {
          date: new Date('2024-12-10'),
          doctorName: 'Dr. Ionescu',
          notes: 'Control de rutină, recomandare pentru analize'
        },
        {
          date: new Date('2025-03-15'),
          doctorName: 'Dr. Marinescu',
          notes: 'Tensiune crescută, început tratament'
        }
      ],
      recommendations: []
    },
    {
      id: 2,
      email: 'andrei.ionescu@example.com',
      phone: '0744987654',
      firstName: 'Andrei',
      lastName: 'Ionescu',
      cnp: '1961109123456',
      occupation: 'Programator',
      locality: 'București',
      street: 'Bd. Unirii',
      number: '45',
      block: 'C3',
      staircase: '1',
      apartment: 10,
      floor: 3,
      bloodGroup: 'B',
      rh: '-',
      weight: 75.2,
      height: 180,
      validAccount: true,
      allergies: 'Lactoză',
      diseases: [
        {
          name: 'Diabet tip 2',
          type: 'chronic',
          description: 'Diagnosticat în 2020, sub tratament'
        }
      ],
      birthDate: new Date('1996-11-09'),
      sex: 'M',
      consultations: [
        {
          date: new Date('2024-10-05'),
          doctorName: 'Dr. Pavelescu',
          notes: 'Valori glicemie instabile, ajustare tratament'
        },
        {
          date: new Date('2025-01-20'),
          doctorName: 'Dr. Pavelescu',
          notes: 'Răspunde bine la tratament, recomandare activitate fizică'
        }
      ],
      recommendations: [
        {
          activityType: 'Înot',
          dailyDuration: 45,
          startDate: new Date('2025-02-01'),
          endDate: new Date('2025-07-01'),
          additionalNotes: 'De 3 ori pe săptămână, minim 45 min.'
        },
        {
          activityType: 'Plimbări în aer liber',
          dailyDuration: 20,
          startDate: new Date('2025-03-10'),
          additionalNotes: 'Dimineața devreme, pentru reglarea glicemiei'
        }
      ],
      alarms: [
        {
          parameter: 'humidity',
          condition: '<',
          threshold: 30,
          duration: 300,
          afterActivity: false,
          message: 'Aer prea uscat. Hidratează-te și evită efortul.'
        },
        {
          parameter: 'pulse',
          condition: '>',
          threshold: 130,
          duration: 45,
          afterActivity: true,
          message: 'Puls crescut semnificativ după efort.'
        }
      ]
    },
    {
      id: 3,
      email: 'andrei.moldovan@example.com',
      phone: '0766777888',
      firstName: 'Andrei',
      lastName: 'Moldovan',
      cnp: '1821122123456',
      occupation: 'Arhitect',
      locality: 'Timișoara',
      street: 'Strada Calea Aradului',
      number: '102',
      block: 'E5',
      staircase: 'A',
      apartment: 3,
      floor: 1,
      bloodGroup: 'AB',
      rh: '+',
      weight: 80.7,
      height: 183,
      allergies: '',
      validAccount: true,
      diseases: [
        {
          name: 'Boala Parkinson',
          type: 'chronic',
          description: 'Tulburare degenerativă a sistemului nervos ce afectează mișcările.'
        },
        {
          name: 'Boala celiacă',
          type: 'chronic',
          description: 'Intoleranță la gluten, provoacă leziuni intestinale.'
        },
        {
          name: 'Bronșită cronică',
          type: 'chronic',
          description: 'Inflamație prelungită a bronhiilor, adesea cauzată de fumat.'
        },
        {
          name: 'Insuficiență renală cronică',
          type: 'chronic',
          description: 'Pierderea treptată a funcției rinichilor.'
        }
      ],
      birthDate: new Date('1982-12-22'),
      sex: 'M',
      consultations: [],
      recommendations: [
        {
          activityType: 'Alergare ușoară',
          dailyDuration: 25,
          startDate: new Date('2025-05-01'),
          endDate: new Date('2025-07-31'),
          additionalNotes: 'Parc dimineața, evitând orele de vârf'
        }
      ],
      alarms: [
        {
          parameter: 'ecg',
          condition: '=',
          threshold: 0,
          duration: 60,
          afterActivity: false,
          message: 'Semnal ECG pierdut. Verifică senzorul.'
        }
      ]
    },
    {
      id: 4,
      email: 'maria.dumitru@example.com',
      phone: '0755432167',
      firstName: 'Maria',
      lastName: 'Dumitru',
      cnp: '2870316123456',
      occupation: 'Economist',
      locality: 'Iași',
      street: 'Strada Independenței',
      number: '99',
      block: 'D2',
      staircase: 'B',
      apartment: 8,
      floor: 2,
      bloodGroup: '0',
      rh: '+',
      weight: 62.3,
      height: 170,
      allergies: 'Nuci',
      validAccount: true,
      diseases: [
        {
          name: 'Talassemie majoră',
          type: 'genetic',
          description: 'Boală ereditară a sângelui, necesită monitorizare constantă.'
        }
      ],
      birthDate: new Date('1987-03-16'),
      sex: 'F',
      consultations: [
        {
          date: new Date('2025-04-11'),
          doctorName: 'Dr. Georgescu',
          notes: 'Verificare hemoglobină, necesar transfuzie lunară'
        }
      ],
      recommendations: [],
      alarms: [
        {
          parameter: 'hemoglobin',
          condition: '<',
          threshold: 8,
          duration: 120,
          afterActivity: false,
          message: 'Nivel hemoglobină scăzut, necesară evaluare.'
        }
      ]
    },
    {
      id: 6,
      email: 'radu.enache@example.com',
      phone: '0788888899',
      firstName: 'Radu',
      lastName: 'Enache',
      cnp: '1990704123456',
      occupation: 'Student',
      locality: 'Constanța',
      street: 'Strada Traian',
      number: '15',
      block: 'F7',
      staircase: 'C',
      apartment: 12,
      floor: 4,
      bloodGroup: 'A',
      rh: '-',
      weight: 68.9,
      height: 178,
      allergies: '',
      validAccount: true,
      diseases: [
        {
          name: 'Faringită acută',
          type: 'acute',
          description: 'Infecție recentă a gâtului, tratament cu antibiotice.'
        },
        {
          name: 'Gastroenterită virală',
          type: 'acute',
          description: 'Infecție virală a tractului digestiv, simptome ușoare.'
        }
      ],
      birthDate: new Date('1999-07-04'),
      sex: 'M',
      consultations: [
        {
          date: new Date('2025-05-20'),
          doctorName: 'Dr. Nistor',
          notes: 'Prescris antibiotic și repaus alimentar'
        }
      ],
      recommendations: [
        {
          activityType: 'Odihnă',
          dailyDuration: 90,
          startDate: new Date('2025-05-21'),
          additionalNotes: 'Fără activitate fizică în timpul tratamentului'
        },
        {
          activityType: 'Alergare',
          dailyDuration: 90,
          startDate: new Date('2025-05-21'),
          additionalNotes: 'Fără activitate fizică în timpul tratamentului'
        },
        {
          activityType: 'Odihnă',
          dailyDuration: 90,
          startDate: new Date('2025-05-21'),
          additionalNotes: 'Fără activitate fizică în timpul tratamentului'
        }
      ],
      alarms: []
    }
  ]

  getPatients(): Observable<any[]> {
    return of(this.patient)
  }
}
