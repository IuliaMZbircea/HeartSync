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
import {ViewEHRComponent} from "./view-ehr/view-ehr.component";
import {ViewConsultationsComponent} from "./view-consultations/view-consultations.component";

export const routes: Routes = [
  { path: '', component: PresentationPageComponent },
  { path: 'Home', component: PresentationPageComponent },
  { path: 'Help', component: HelpSectionComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'PatientList', component: PatientListComponent },
  { path: 'add-patient', component: AddPatientComponent },
  { path: 'view-alert', component: ViewAlertsComponent },
  { path: 'view-medication', component: ViewMedicationComponent },
  { path: 'view-recommendation', component: ViewRecommendationComponent },
  { path: 'view-consultations', component: ViewConsultationsComponent },
  { path: 'view-allergies', component: ViewAllergiesComponent },
  { path: 'view-ehr', component: ViewEHRComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
