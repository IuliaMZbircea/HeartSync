import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {Patient} from "../interfaces/patient";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor() { }

  patient:Patient[]= [
    {
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
      diseases: [
        {
          name: 'Hipertensiune arterială',
          category: 'Cardiovascular',
          description: 'Tensiune arterială ridicată observată în ultimii 2 ani'
        },
        {
          name: 'Astm',
          category: 'Respirator',
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
      recommendations: [
        {
          activityType: 'Mers pe jos',
          dailyDuration: 30,
          startDate: new Date('2025-04-01'),
          endDate: new Date('2025-06-30'),
          additionalNotes: 'Ideal dimineața, în parc'
        },
        {
          activityType: 'Exerciții de respirație',
          dailyDuration: 10,
          startDate: new Date('2025-05-01'),
          additionalNotes: 'De efectuat acasă, dimineața și seara'
        }
      ]
    },
    {
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
      allergies: 'Lactoză',
      diseases: [
        {
          name: 'Diabet tip 2',
          category: 'Metabolic',
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
      email: 'mihai.ionescu@example.com',
      phone: '0733111222',
      firstName: 'Mihai',
      lastName: 'Ionescu',
      cnp: '1950410123456',
      occupation: 'Inginer software',
      locality: 'București',
      street: 'Strada Aviatorilor',
      number: '45A',
      block: 'C2',
      staircase: '1',
      apartment: 12,
      floor: 3,
      bloodGroup: 'B',
      rh: '-',
      weight: 75.2,
      height: 178,
      allergies: 'Nuci',
      diseases: [
        {
          name: 'Diabet tip 2',
          category: 'Metabolic',
          description: 'Diagnosticat în 2020, sub control cu dietă'
        }
      ],
      birthDate: new Date('1995-04-10'),
      sex: 'M',
      consultations: [
        {
          date: new Date('2025-01-20'),
          doctorName: 'Dr. Georgescu',
          notes: 'Evaluare periodică, valori glicemie normale'
        }
      ],
      recommendations: [
        {
          activityType: 'Înot',
          dailyDuration: 45,
          startDate: new Date('2025-02-01'),
          endDate: new Date('2025-05-31'),
          additionalNotes: 'De 3 ori pe săptămână'
        }
      ],
      alarms: [
        {
          parameter: 'pulse',
          condition: '>',
          threshold: 120,
          duration: 30,
          afterActivity: true,
          message: 'Puls ridicat după activitate fizică. Odihnă recomandată.'
        },
        {
          parameter: 'temperature',
          condition: '>',
          threshold: 37.8,
          duration: 60,
          afterActivity: false,
          message: 'Temperatură corporală crescută. Posibilă infecție.'
        }
      ]
    },
    {
      email: 'elena.stan@example.com',
      phone: '0744555666',
      firstName: 'Elena',
      lastName: 'Stan',
      cnp: '2880314123456',
      occupation: 'Profesor',
      locality: 'Iași',
      street: 'Strada Independenței',
      number: '88',
      block: 'D4',
      staircase: '3',
      apartment: 20,
      floor: 5,
      bloodGroup: 'O',
      rh: '+',
      weight: 62,
      height: 170,
      allergies: 'Lactoză',
      diseases: [
        {
          name: 'Anemie feriprivă',
          category: 'Hematologic',
          description: 'Niveluri scăzute de fier observate la analize'
        }
      ],
      birthDate: new Date('1988-03-14'),
      sex: 'F',
      consultations: [
        {
          date: new Date('2024-11-05'),
          doctorName: 'Dr. Vasilescu',
          notes: 'Oboseală generalizată, recomandare suplimente'
        }
      ],
      recommendations: [
        {
          activityType: 'Yoga',
          dailyDuration: 20,
          startDate: new Date('2025-01-10'),
          endDate: new Date('2025-04-10'),
          additionalNotes: 'Relaxare și reducerea stresului'
        }
      ],
      alarms: [
        {
          parameter: 'pulse',
          condition: '>',
          threshold: 110,
          duration: 30,
          afterActivity: true,
          message: 'Pulsul este prea mare după mers. Se recomandă pauză.'
        },
        {
          parameter: 'temperature',
          condition: '>',
          threshold: 38,
          duration: 60,
          afterActivity: false,
          message: 'Febră detectată. Se recomandă consult medical.'
        }
      ]

    },
    {
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
      diseases: [],
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
    }
  ]

  getPatients():Observable<any[]>{
    return of(this.patient)
 }
}
