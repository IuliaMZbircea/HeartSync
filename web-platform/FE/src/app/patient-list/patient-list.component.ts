import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PatientService} from "../services/patient.service";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {HoverScaleDirective} from "../directives/hover-scale.directive";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatDivider} from "@angular/material/divider";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {AddNewConsultationComponent} from "../dialogs/add-new-consultation/add-new-consultation.component";
import {ConfirmationDialogComponent} from "../dialogs/confirmation-dialog/confirmation-dialog.component";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AddNewAlarmComponent} from "../dialogs/add-new-alarm/add-new-alarm.component";
import {AddNewRecommendationComponent} from "../dialogs/add-new-recommendation/add-new-recommendation.component";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatBadge} from "@angular/material/badge";

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    MatTableModule,
    HoverScaleDirective,
    MatPaginatorModule,
    MatDivider,
    MatSortModule,
    MatFormField,
    MatInput,
    MatIcon,
    MatIconButton,
    MatBadge
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css'
})

export class PatientListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id','name', 'consultation','charts','alarms','recommendation','settings'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  alarmCount:number=5

 constructor(private patientService:PatientService, private dialog: MatDialog) { }

  ngOnInit() {
    this.patientService.getPatients().subscribe((values) => {
      const modifiedValues = values.map(patient => ({
        ...patient,
        name: `${patient.firstName} ${patient.lastName}`
      }));

      this.dataSource.data = modifiedValues;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = (data, filter) =>
        data.name.toLowerCase().includes(filter);
    });
  }

 ngAfterViewInit(){
   this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
 }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddConsultationDialog() {
    this.dialog.open(AddNewConsultationComponent, {
      width: '60%',
      height: '95%',
      data: { }
    });
  }

  openDeleteConfirmationDialog() {
    this.dialog.open(ConfirmationDialogComponent, {
      width: '20%',
      height: '20%',
      data: { }
    });
  }

  openAddAlarmDialog(id:string) {
    this.dialog.open(AddNewAlarmComponent, {
      width: '20%',
      height: '100%',
      data: { id: id },
      panelClass: 'custom-dialog-shadow'
    });
  }

  openRecommendationDialog(id:string) {
    this.dialog.open(AddNewRecommendationComponent, {
      width: '20%',
      height: '90%',
      data: { id: id }
    });
  }
}
