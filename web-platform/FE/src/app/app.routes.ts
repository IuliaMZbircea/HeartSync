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
import {AdminDashboardComponent} from "./admin/admin-dashboard/admin-dashboard.component";
import {DoctorsListComponent} from "./admin/doctors-list/doctors-list.component";
import {AuditFileComponent} from "./admin/audit-file/audit-file.component";
import {AuditAllergiesComponent} from "./admin/audit-allergies/audit-allergies.component";
import {AuditRecommendationComponent} from "./admin/audit-recommendation/audit-recommendation.component";
import {AuditMedicationComponent} from "./admin/audit-medication/audit-medication.component";
import {AuditAlarmsComponent} from "./admin/audit-alarms/audit-alarms.component";
import {AuditRefferalComponent} from "./admin/audit-refferal/audit-refferal.component";
import {AuditConsultationComponent} from "./admin/audit-consultation/audit-consultation.component";
import {AuditPatientComponent} from "./admin/audit-patient/audit-patient.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";

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
  {
    path: 'doctors-list',
    component: DoctorsListComponent,
    canActivate: [RoleGuard],
    data: {expectedRole: 'ROLE_ADMIN'}
  },
  {
    path: 'audit-file',
    component: AuditFileComponent,
    canActivate: [RoleGuard],
    data: {expectedRole: 'ROLE_ADMIN'}
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN'}
  },
  {
    path: 'audit-allergies',
    component: AuditAllergiesComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN'}
  },
  {
    path: 'audit-recommendations',
    component: AuditRecommendationComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN'}
  },
  {
    path: 'audit-medications',
    component: AuditMedicationComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN'}
  },
  {
    path: 'audit-alarms',
    component: AuditAlarmsComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN'}
  },
  {
    path: 'audit-referrals',
    component: AuditRefferalComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN'}
  },
  {
    path: 'audit-consultations',
    component: AuditConsultationComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN'}
  },
  {
    path: 'audit-patients',
    component: AuditPatientComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'ROLE_ADMIN'}
  },
  { path: 'add-patient', component: AddPatientComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
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
