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
      allergies:
        {
          name: "Polen",
        severity: "medium",
        reaction: "Strănut, ochi înlăcrimați, congestie nazală",
        notes: "Se manifestă mai ales primăvara și toamna"
        },
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
          id: 2,
          dateTime: new Date('2025-06-02'),
          doctorName: 'Dr. Elena Radu',
          durationMinutes: 30,

          symptoms: 'Pressure in chest, shortness of breath, anxiety',
          currentMedication: [
            {
              name: 'Aspirin',
              dose: '75mg',
              frequency: 'Once daily',
              route: 'Oral',
              startDate: new Date('2025-06-01'),
              prescribedBy: 'Dr. Elena Radu',
              notes: 'Used to reduce clot risk'
            }
          ],
          medicalHistory: [
         {    code: 'I10',
              name: 'Essential Hypertension',
              category: 'Cardiovascular',
              description: 'Chronic high blood pressure without identifiable cause'
            }
          ],
          familyHistory: 'Father had coronary artery disease.',

          pulse: 88,
          bloodPressure: '140/90',
          temperature: 36.8,
          weightKg: 78,
          heightCm: 175,
          respiratoryRate: 18,
          notes: 'Referred for cardiac stress test. ECG showed mild ST depression.',

          diagnosis: [
            {
              code: 'I10',
              name: 'Unstable Angina',
              category: 'Cardiovascular',
              description: 'A condition in which the heart doesn’t get enough blood flow and oxygen.'
            }
          ],

          referralIds: [101],
          prescriptionIds: [201]
        },
        {
          id: 3,
          dateTime: new Date('2025-06-06'),
          doctorName: 'Dr. Andrei Popescu',
          durationMinutes: 25,

          symptoms: 'Fatigue, minor palpitations',
          currentMedication: [
            {
              name: 'Metoprolol',
              dose: '50mg',
              frequency: 'Once daily',
              route: 'Oral',
              startDate: new Date('2025-05-15'),
              prescribedBy: 'Dr. Andrei Popescu',
              notes: 'Beta-blocker to manage heart rhythm and reduce workload on the heart.'
            }
          ],
          medicalHistory: [
            {
              code: 'I10',
              name: 'Acute Myocardial Infarction',
              category: 'Cardiovascular',
              description: 'A heart attack occurring due to complete blockage of a coronary artery.'
            }
          ],
          familyHistory: 'Mother had hypertension.',

          pulse: 76,
          bloodPressure: '130/85',
          temperature: 36.6,
          weightKg: 80,
          heightCm: 178,
          respiratoryRate: 17,
          notes: 'Patient recovering well. Continue medication. Recommended mild physical activity.',

          diagnosis: [
            {
              code: 'I10',
              name: 'Old Myocardial Infarction',
              category: 'Cardiovascular',
              description: 'Evidence of previous heart attack; patient not in acute phase.'
            }
          ],

          referralIds: [],
          prescriptionIds: [202]
        }
      ],
      recommendations: [],
      referrals: [
        {
          id: 101,
          type: 'FAMILY_TO_SPECIALIST',
          patientId: 1,
          fromDoctor:   {
            "id": 1,
            "email": "dr.magda@example.com",
            "password": "test123",
            "firstName": "Magda",
            "lastName": "Paicu",
            "specialization": "Cardiology"
          },
          toDoctor: {
            "id": 2,
            "email": "dr.luyza@example.com",
            "password": "test123",
            "firstName": "Luyza",
            "lastName": "Nica",
            "specialization": "Neurology"
          },
          reason: 'Suspicion of diabetes',
          date: new Date('2025-05-01'),
          isResolved: false
        },
        {
          id: 102,
          type: 'SPECIALIST_TO_ANALYSIS',
          patientId: 1,
          fromDoctor: {
            "id": 1,
            "email": "dr.magda@example.com",
            "password": "test123",
            "firstName": "Magda",
            "lastName": "Paicu",
            "specialization": "Cardiology"
          },
          toDoctor: {
            "id": 2,
            "email": "dr.luyza@example.com",
            "password": "test123",
            "firstName": "Luyza",
            "lastName": "Nica",
            "specialization": "Neurology"
          },
          reason: 'Blood sugar test',
          date: new Date('2025-05-10'),
          isResolved: true,
          hl7Payload: 'some-hl7-payload',
          fhirResponseId: 555
        }
      ],
      patientHistory:{},
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
      allergies:  {
        name: "Arahide",
        severity: "high",
        reaction: "Umflare a buzelor, dificultăți de respirație, șoc anafilactic",
        notes: "Necesită epipen"
      },
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
          id: 3,
          dateTime: new Date('2025-06-06'),
          doctorName: 'Dr. Andrei Popescu',
          durationMinutes: 25,

          symptoms: 'Fatigue, minor palpitations',
          currentMedication: [
            {
              name: 'Metoprolol',
              dose: '50mg',
              frequency: 'Once daily',
              route: 'Oral',
              startDate: new Date('2025-05-15'),
              prescribedBy: 'Dr. Andrei Popescu',
              notes: 'Beta-blocker to manage heart rhythm and reduce workload on the heart.'
            }
          ],
          medicalHistory: [
            {
              code: 'I10',
              name: 'Acute Myocardial Infarction',
              category: 'Cardiovascular',
              description: 'A heart attack occurring due to complete blockage of a coronary artery.'
            }
          ],
          familyHistory: 'Mother had hypertension.',

          pulse: 76,
          bloodPressure: '130/85',
          temperature: 36.6,
          weightKg: 80,
          heightCm: 178,
          respiratoryRate: 17,
          notes: 'Patient recovering well. Continue medication. Recommended mild physical activity.',

          diagnosis: [
            {
              code: 'I10',
              name: 'Old Myocardial Infarction',
              category: 'Cardiovascular',
              description: 'Evidence of previous heart attack; patient not in acute phase.'
            }
          ],

          referralIds: [],
          prescriptionIds: [202]
        },
        {
          id: 6,
          dateTime: new Date('2025-06-06'),
          doctorName: 'Dr. Andrei Popescu',
          durationMinutes: 25,

          symptoms: 'Fatigue, minor palpitations',
          currentMedication: [
            {
              name: 'Metoprolol',
              dose: '50mg',
              frequency: 'Once daily',
              route: 'Oral',
              startDate: new Date('2025-05-15'),
              prescribedBy: 'Dr. Andrei Popescu',
              notes: 'Beta-blocker to manage heart rhythm and reduce workload on the heart.'
            }
          ],
          medicalHistory: [
            {
              code: 'I10',
              name: 'Acute Myocardial Infarction',
              category: 'Cardiovascular',
              description: 'A heart attack occurring due to complete blockage of a coronary artery.'
            }
          ],
          familyHistory: 'Mother had hypertension.',

          pulse: 76,
          bloodPressure: '130/85',
          temperature: 36.6,
          weightKg: 80,
          heightCm: 178,
          respiratoryRate: 17,
          notes: 'Patient recovering well. Continue medication. Recommended mild physical activity.',

          diagnosis: [
            {
              code: 'I10',
              name: 'Old Myocardial Infarction',
              category: 'Cardiovascular',
              description: 'Evidence of previous heart attack; patient not in acute phase.'
            }
          ],

          referralIds: [],
          prescriptionIds: [202]
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
      ],
      patientHistory : {
        pulse: [
          {
            date: '2025-06-08',
            value: 78,
            hourly: [65, 68, 70, 72, 75, 78, 80, 82, 84, 83, 82, 80, 78, 76, 75, 74, 73, 72, 70, 69, 68, 67, 66, 65],
          },
          {
            date: '2025-06-07',
            value: 81,
            hourly: [68, 70, 73, 75, 78, 80, 82, 84, 85, 83, 81, 80, 78, 77, 75, 74, 72, 71, 70, 69, 68, 67, 66, 65],
          },
          {
            date: '2025-06-06',
            value: 76,
            hourly: [66, 68, 70, 72, 74, 76, 78, 80, 81, 80, 78, 76, 74, 72, 70, 68, 66, 65, 67, 69, 70, 72, 73, 74],
          },
        ],

        bodyTemperature: [
          {
            date: '2025-06-08',
            value: 36.2,
            hourly: new Array(24).fill(0).map(() => (Math.random() * 0.4 + 36).toFixed(1)),
          },
          {
            date: '2025-06-07',
            value: 36.3,
            hourly: new Array(24).fill(0).map(() => (Math.random() * 0.4 + 36).toFixed(1)),
          },
          {
            date: '2025-06-06',
            value: 36.1,
            hourly: new Array(24).fill(0).map(() => (Math.random() * 0.4 + 36).toFixed(1)),
          },
        ],

        bloodPressure: [
          {
            date: '2025-06-08',
            systolic: 122,
            diastolic: 78,
            hourly: [
              { systolic: 120, diastolic: 76 },
              { systolic: 121, diastolic: 77 },
              { systolic: 122, diastolic: 78 },
              { systolic: 123, diastolic: 79 },
              { systolic: 124, diastolic: 80 },
              { systolic: 122, diastolic: 78 },
            ],
          },
          {
            date: '2025-06-07',
            systolic: 124,
            diastolic: 80,
            hourly: [
              { systolic: 121, diastolic: 77 },
              { systolic: 122, diastolic: 78 },
              { systolic: 123, diastolic: 79 },
              { systolic: 124, diastolic: 80 },
              { systolic: 125, diastolic: 81 },
              { systolic: 124, diastolic: 80 },
            ],
          },
          {
            date: '2025-06-06',
            systolic: 126,
            diastolic: 82,
            hourly: [
              { systolic: 123, diastolic: 79 },
              { systolic: 124, diastolic: 80 },
              { systolic: 125, diastolic: 81 },
              { systolic: 126, diastolic: 82 },
              { systolic: 127, diastolic: 83 },
              { systolic: 126, diastolic: 82 },
            ],
          },
        ],

        spo2: [
          {
            date: '2025-06-08',
            value: 98,
            hourly: Array(24).fill(0).map(() => 97 + Math.round(Math.random())),
          },
          {
            date: '2025-06-07',
            value: 97,
            hourly: Array(24).fill(0).map(() => 97 + Math.round(Math.random())),
          },
          {
            date: '2025-06-06',
            value: 96,
            hourly: Array(24).fill(0).map(() => 96 + Math.round(Math.random())),
          },
        ],

        respiratoryRate: [
          {
            date: '2025-06-08',
            value: 16,
            hourly: Array(24).fill(0).map(() => 15 + Math.round(Math.random())),
          },
          {
            date: '2025-06-07',
            value: 17,
            hourly: Array(24).fill(0).map(() => 15 + Math.round(Math.random())),
          },
          {
            date: '2025-06-06',
            value: 16,
            hourly: Array(24).fill(0).map(() => 15 + Math.round(Math.random())),
          },
        ]
      }
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
      allergies:   {
        name: "Lapte",
        severity: "low",
        reaction: "Balonare, dureri abdominale",
        notes: "Toleranță scăzută, dar nu este alergie severă"
      },
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
      ],
      medications:[
        {
          name: "Perindopril",
          dose: "5 mg",
          frequency: "1 tabletă dimineața",
          route: "oral",
          startDate: new Date("2024-04-10"),
          prescribedBy: "Dr. Ionescu Gheorghe",
          notes: "Se administrează pe nemâncate."
        },
        {
          name: "Metoprolol",
          dose: "50 mg",
          frequency: "2 ori pe zi",
          route: "oral",
          startDate: new Date("2024-03-15"),
          endDate: new Date("2024-06-15"),
          prescribedBy: "Dr. Popescu Andrei",
          notes: "Monitorizare puls. Se evită întreruperea bruscă."
        },
        {
          name: "Xarelto",
          dose: "20 mg",
          frequency: "1 dată pe zi seara",
          route: "oral",
          startDate: new Date("2024-01-01"),
          prescribedBy: "Dr. Vasilescu Irina",
          notes: "Se ia cu mâncare."
        }
      ],
      patientHistory:{},
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
      allergies: {
        name: "Mușcătură de albină",
        severity: "high",
        reaction: "Umflare severă, erupții, dificultăți respiratorii",
        notes: "Reacție anafilactică posibilă, necesită tratament imediat"
      },
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
          id: 3,
          dateTime: new Date('2025-06-06'),
          doctorName: 'Dr. Andrei Popescu',
          durationMinutes: 25,

          symptoms: 'Fatigue, minor palpitations',
          currentMedication: [
            {
              name: 'Metoprolol',
              dose: '50mg',
              frequency: 'Once daily',
              route: 'Oral',
              startDate: new Date('2025-05-15'),
              prescribedBy: 'Dr. Andrei Popescu',
              notes: 'Beta-blocker to manage heart rhythm and reduce workload on the heart.'
            }
          ],
          medicalHistory: [
            {
              code: 'I10',
              name: 'Acute Myocardial Infarction',
              category: 'Cardiovascular',
              description: 'A heart attack occurring due to complete blockage of a coronary artery.'
            }
          ],
          familyHistory: 'Mother had hypertension.',

          pulse: 76,
          bloodPressure: '130/85',
          temperature: 36.6,
          weightKg: 80,
          heightCm: 178,
          respiratoryRate: 17,
          notes: 'Patient recovering well. Continue medication. Recommended mild physical activity.',

          diagnosis: [
            {
              code: 'I10',
              name: 'Old Myocardial Infarction',
              category: 'Cardiovascular',
              description: 'Evidence of previous heart attack; patient not in acute phase.'
            }
          ],

          referralIds: [],
          prescriptionIds: [202]
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
      ],
      medications:[
        {
          name: "Perindopril",
          dose: "5 mg",
          frequency: "1 tabletă dimineața",
          route: "oral",
          startDate: new Date("2024-04-10"),
          prescribedBy: "Dr. Ionescu Gheorghe",
          notes: "Se administrează pe nemâncate."
        },
        {
          name: "Metoprolol",
          dose: "50 mg",
          frequency: "2 ori pe zi",
          route: "oral",
          startDate: new Date("2024-03-15"),
          endDate: new Date("2024-06-15"),
          prescribedBy: "Dr. Popescu Andrei",
          notes: "Monitorizare puls. Se evită întreruperea bruscă."
        },
        {
          name: "Xarelto",
          dose: "20 mg",
          frequency: "1 dată pe zi seara",
          route: "oral",
          startDate: new Date("2024-01-01"),
          prescribedBy: "Dr. Vasilescu Irina",
          notes: "Se ia cu mâncare."
        }
      ],
      patientHistory:{},
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
      allergies:   {
        name: "Lapte",
        severity: "low",
        reaction: "Balonare, dureri abdominale",
        notes: "Toleranță scăzută, dar nu este alergie severă"
      },
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
          id: 2,
          dateTime: new Date('2025-06-02'),
          doctorName: 'Dr. Elena Radu',
          durationMinutes: 30,

          symptoms: 'Pressure in chest, shortness of breath, anxiety',
          currentMedication: [
            {
              name: 'Aspirin',
              dose: '75mg',
              frequency: 'Once daily',
              route: 'Oral',
              startDate: new Date('2025-06-01'),
              prescribedBy: 'Dr. Elena Radu',
              notes: 'Used to reduce clot risk'
            }
          ],
          medicalHistory: [
            {
              code: 'I10',
              name: 'Essential Hypertension',
              category: 'Cardiovascular',
              description: 'Chronic high blood pressure without identifiable cause'
            }
          ],
          familyHistory: 'Father had coronary artery disease.',

          pulse: 88,
          bloodPressure: '140/90',
          temperature: 36.8,
          weightKg: 78,
          heightCm: 175,
          respiratoryRate: 18,
          notes: 'Referred for cardiac stress test. ECG showed mild ST depression.',

          diagnosis: [
            {
              code: 'I10',
              name: 'Unstable Angina',
              category: 'Cardiovascular',
              description: 'A condition in which the heart doesn’t get enough blood flow and oxygen.'
            }
          ],

          referralIds: [101],
          prescriptionIds: [201]
        },
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
      alarms: [],
      medications:[
        {
          name: "Perindopril",
          dose: "5 mg",
          frequency: "1 tabletă dimineața",
          route: "oral",
          startDate: new Date("2024-04-10"),
          prescribedBy: "Dr. Ionescu Gheorghe",
          notes: "Se administrează pe nemâncate."
        },
        {
          name: "Metoprolol",
          dose: "50 mg",
          frequency: "2 ori pe zi",
          route: "oral",
          startDate: new Date("2024-03-15"),
          endDate: new Date("2024-06-15"),
          prescribedBy: "Dr. Popescu Andrei",
          notes: "Monitorizare puls. Se evită întreruperea bruscă."
        },
        {
          name: "Xarelto",
          dose: "20 mg",
          frequency: "1 dată pe zi seara",
          route: "oral",
          startDate: new Date("2024-01-01"),
          prescribedBy: "Dr. Vasilescu Irina",
          notes: "Se ia cu mâncare."
        }
      ],
      patientHistory:{},
    }
  ]

  getPatients(): Observable<any[]> {
    return of(this.patient)
  }

  updatePatient(updatedPatient: Patient): void {
    const index = this.patient.findIndex(p => p.id === updatedPatient.id);
    if (index !== -1) {
      this.patient[index] = { ...updatedPatient };
    } else {
      console.warn('Patient not found for update');
    }
  }

}
