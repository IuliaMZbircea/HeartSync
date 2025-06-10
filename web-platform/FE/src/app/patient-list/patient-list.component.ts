import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PatientService} from "../../services/patient.service";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatInput} from "@angular/material/input";
import calculateRiskScore from "../utils/calculate-risk-score";
import {NgClass, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import calculateAge from "../utils/calculate-age";
import {MatTooltip} from "@angular/material/tooltip";
import {Patient} from "../../shared/interfaces/patient";

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInput,
    NgClass,
    RouterLink,
    MatTooltip,
    NgIf
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css'
})

export class PatientListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'patient', 'diseases', 'alerts', 'risk', 'actions'];
  dataSource = new MatTableDataSource<Patient & { age: number; alert: number }>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit() {
    this.patientService.getPatients().subscribe(patients => {
      this.dataSource.data = patients.map(patient => ({
        ...patient,
        age: calculateAge(patient.birthDate),
        alert: patient.sensorAlertThresholds ? patient.sensorAlertThresholds.length : 0
      }));

      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'id': return +item.id;
          case 'patient': return (item.firstName + ' ' + item.lastName).toLowerCase();
          case 'alerts': return item.alert || 0;
          case 'risk':
            const risk = this.getRiskType(item);
            return risk === 'high' ? 3 : risk === 'medium' ? 2 : 1;
          default: return (item as any)[property];
        }
      };

      this.dataSource.filterPredicate = (data, filter) => {
        const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
        return fullName.includes(filter);
      };

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRiskType(patient: Patient & { alert: number }): string {
    const diseaseTypes = (patient.diseases || []).map(d => d.category || '');
    return calculateRiskScore(diseaseTypes, patient.alert);
  }

  getRiskColor(patient: Patient & { alert: number }): string {
    const risk = this.getRiskType(patient);
    switch (risk) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-400';
      default: return 'bg-green-600';
    }
  }

  openEmrDialog(id: string) {
    this.router.navigate([`/view-emr`, id]);
  }

  openMedicationsDialog(id:string) {
      this.router.navigate([`/view-medication`, id]);

  }

  openAllergiesDialog(id:string) {
    this.router.navigate([`/view-allergies`, id]);
  }
  getDiseaseNames(diseases: any[] | undefined): string {
    if (!Array.isArray(diseases)) return '-';
    return diseases.map(d => d.name).join(', ');
  }

  openConsultationsDialog(id:string) {
    this.router.navigate([`/view-consultations`, id]);
  }

  openRecommendationsDialog(id:string) {
    this.router.navigate([`/view-recommendation`, id]);
  }

  goToAlertDetail(id: string) {
    this.router.navigate([`/view-alerts`, id]);
  }

  openReferralsDialog(id:string) {
    this.router.navigate([`/view-referrals`, id]);
  }

  openChartsDialog(id:string){
    this.router.navigate([`/view-charts`, id]);
  }
}


