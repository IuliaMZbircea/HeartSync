import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PatientService} from "../services/patient.service";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatInput} from "@angular/material/input";
import calculateRiskScore from "../utils/calculate-risk-score";
import {NgClass} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import calculateAge from "../utils/calculate-age";

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInput,
    NgClass,
    RouterLink
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css'
})

export class PatientListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id','patient', 'diseases','alerts','risk','actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

 constructor(private patientService:PatientService, private router: Router) {
 }

  ngOnInit() {
    this.patientService.getPatients().subscribe((values) => {
      this.dataSource.data = values.map(patient => ({
        ...patient,
        age: calculateAge(patient.birthDate),
        alert: patient.alarms ? patient.alarms.length : 0

      }));
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'id':
            return +item.id;
          case 'patient':
            return item.firstName.toLowerCase();
          case 'diagnostic':
            return item.consultatii && item.consultatii.length > 0
              ? item.consultatii[0].diagnostic.toLowerCase()
              : '';
          case 'alerts':
            return item.alert || 0;
          case 'risk':
            const risk = this.getRiskType(item);
            switch (risk) {
              case 'high': return 3;
              case 'medium': return 2;
              case 'low': return 1;
              default: return 0;
            }
          default:
            return item[property];
        }
      };

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = (data, filter) =>
        data.name.toLowerCase().includes(filter);
    });
  }

  getRiskColor(patient: any): string {
    const diseaseTypes: string[] = (patient.diseases || []).map((d: any) => d.type || '');

    const alerts = patient.alert || 0;

    const risk = calculateRiskScore(diseaseTypes, alerts);

    switch(risk) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-yellow-400';
      case 'low':
      default:
        return 'bg-green-600';
    }
  }

  getRiskType(patient: any): string {
    const diseaseTypes: string[] = (patient.diseases || []).map((d: any) => d.type || '');
    const alerts = patient.alert || 0;
    return calculateRiskScore(diseaseTypes, alerts);
  }

  ngAfterViewInit(){

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


    this.sort.sortChange.emit({ active: this.sort.active, direction: this.sort.direction });
    this.dataSource.paginator = this.paginator;
 }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEhrDialog(id: string) {
    this.router.navigate([`/view-ehr`]);
  }

  openMedicationsDialog(id:string) {
      this.router.navigate([`/view-medication`]);

  }

  openAllergiesDialog(id:string) {
    this.router.navigate([`/view-allergie`]);
  }

  getDiseaseNames(diseases: any[]): string {
    return diseases.map(d => d.name).join(', ');
  }

  openConsultationsDialog(id:string) {
    this.router.navigate([`/view-consultations`, id]);
  }

  openRecommendationsDialog(id:string) {
    this.router.navigate([`/view-recommendation`]);
  }

  goToAlertDetail(id: string) {
    this.router.navigate([`/view-alert`]);
  }
}


