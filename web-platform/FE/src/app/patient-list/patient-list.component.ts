import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PatientService} from "../services/patient.service";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {HoverScaleDirective} from "../directives/hover-scale.directive";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatDivider} from "@angular/material/divider";
import {MatSort, MatSortModule} from "@angular/material/sort";

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    MatTableModule,
    HoverScaleDirective,
    MatPaginatorModule,
    MatDivider,
    MatSortModule
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css'
})

export class PatientListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id','name', 'settings'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

 constructor(private patientService:PatientService) { }

 ngOnInit(){
   this.patientService.getPatients().subscribe((values)=>{
     this.dataSource.data = values;
   })
 }

 ngAfterViewInit(){
   this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
 }
}
