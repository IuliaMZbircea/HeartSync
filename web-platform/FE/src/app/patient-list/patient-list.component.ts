import {Component, OnInit} from '@angular/core';
import {PatientService} from "../services/patient.service";
import {MatTableModule} from "@angular/material/table";

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    MatTableModule
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css'
})

export class PatientListComponent implements OnInit {
 patient:any[]=[];
  displayedColumns: string[] = ['id','name'];
  dataSource = this.patient;

 constructor(private patientService:PatientService) { }

 ngOnInit(){
   this.patientService.getPatients().subscribe((values)=>{
     this.patient=values;
     this.dataSource = this.patient;
   })
 }
}
