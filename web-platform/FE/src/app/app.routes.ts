import { Routes } from '@angular/router';
import {PresentationPageComponent} from "./presentation-page/presentation-page.component";
import {LoginComponent} from "./authentification/login/login.component";
import {RegisterComponent} from "./authentification/register/register.component";
import {HelpSectionComponent} from "./help-section/help-section.component";
import {PatientListComponent} from "./patient-list/patient-list.component";

export const routes: Routes = [
  { path: '', component: PresentationPageComponent },
  { path: 'Home', component: PresentationPageComponent },
  { path: 'Help', component: HelpSectionComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'PatientList', component: PatientListComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
