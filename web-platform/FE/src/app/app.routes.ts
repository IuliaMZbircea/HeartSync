import { Routes } from '@angular/router';
import {PresentationPageComponent} from "./presentation-page/presentation-page.component";
import {LoginComponent} from "./authentification/login/login.component";
import {RegisterComponent} from "./authentification/register/register.component";
import {HelpSectionComponent} from "./help-section/help-section.component";
import {PatientListComponent} from "./patient-list/patient-list.component";
import {AddPatientComponent} from "./add-patient/add-patient.component";
import {ViewAlertsComponent} from "./view-alerts/view-alerts.component";
import {ViewMedicationComponent} from "./view-medication/view-medication.component";
import {ViewRecommendationComponent} from "./view-recommendation/view-recommendation.component";
import {ViewAllergiesComponent} from "./view-allergies/view-allergies.component";
import {ViewEMRComponent} from "./view-emr/view-emr.component";
import {ViewConsultationsComponent} from "./view-consultations/view-consultations.component";
import {AddNewConsultationComponent} from "./dialogs/add-new-consultation/add-new-consultation.component";
import {ViewRefferalComponent} from "./view-refferal/view-refferal.component";
import {ViewChartsComponent} from "./view-charts/view-charts.component";
import {RoleGuard} from "../services/auth-guard";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";

export const routes: Routes = [
  { path: '', component: PresentationPageComponent },
  { path: 'Home', component: PresentationPageComponent },
  { path: 'Help', component: HelpSectionComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Register', component: RegisterComponent },
   {
     path: 'PatientList',
     loadComponent: () => import('./patient-list/patient-list.component').then(m => m.PatientListComponent),
     canActivate: [RoleGuard],
     data: {expectedRole: 'ROLE_DOCTOR'}
   },
  {
    path: 'add-patient',
    component: AddPatientComponent,
    canActivate: [RoleGuard],
    data: {expectedRole: 'ROLE_DOCTOR'}
  },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [RoleGuard], data: { expectedRole: 'ROLE_ADMIN' } },
  { path: 'add-patient', component: AddPatientComponent },
  { path: 'add-consultation', component: AddNewConsultationComponent },
  { path: 'view-alerts/:id', component: ViewAlertsComponent },
  { path: 'view-medication/:id', component: ViewMedicationComponent },
  { path: 'view-recommendation/:id', component: ViewRecommendationComponent },
  { path: 'view-consultations/:id', component: ViewConsultationsComponent },
  { path: 'view-allergies/:id', component: ViewAllergiesComponent },
  { path: 'view-emr/:id', component: ViewEMRComponent },
  { path: 'view-referrals/:id', component: ViewRefferalComponent },
  { path: 'view-charts/:id', component: ViewChartsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
