import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavBarComponent} from "./nav-bar/nav-bar.component";
import {PresentationPageComponent} from "./presentation-page/presentation-page.component";
import {FooterComponent} from "./footer/footer.component";
import {RegisterComponent} from "./authentification/register/register.component";
import {PatientListComponent} from "./patient-list/patient-list.component";
import {DiagnosisCodeComponent} from "./diagnosis-code/diagnosis-code.component";
import {AddNewConsultationComponent} from "./dialogs/add-new-consultation/add-new-consultation.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, FooterComponent, PatientListComponent, DiagnosisCodeComponent, AddNewConsultationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FE';
}
