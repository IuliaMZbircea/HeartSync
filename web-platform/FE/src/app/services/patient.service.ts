import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor() { }

  patient:any[]= [
    {
      id:0,
      name: 'Paicu Maria Magdalena',
    },
    {
      id:1,
      name: 'Mîndruț Cătălina Mihaela',
    },
    {
      id:2,
      name: 'Paicu Maria Magdalena',
    },
    {
      id:3,
      name: 'Nica Andreea Luyza',
    }
  ]

  getPatients():Observable<any[]>{
    return of(this.patient)
 }
}
