import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavBarComponent} from "./nav-bar/nav-bar.component";
import {PresentationPageComponent} from "./presentation-page/presentation-page.component";
import {FooterComponent} from "./footer/footer.component";
import {RegisterComponent} from "./authentification/register/register.component";
import {PatientListComponent} from "./patient-list/patient-list.component";
import {DiagnosisCodeComponent} from "./diagnosis-code/diagnosis-code.component";
import {AddNewConsultationComponent} from "./dialogs/add-new-consultation/add-new-consultation.component";
import {AuthService} from "../services/auth.service";
import {AddPatientComponent} from "./add-patient/add-patient.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, FooterComponent, PatientListComponent, DiagnosisCodeComponent, AddNewConsultationComponent, AddPatientComponent],
  providers: [AuthService, TranslateService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'FE';
  constructor(private authService: AuthService, private translateService: TranslateService,private router: Router) {
    this.translateService.use('en');}


  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe();
  }
}
