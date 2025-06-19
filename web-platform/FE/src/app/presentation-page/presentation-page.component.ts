import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-presentation-page',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  templateUrl: './presentation-page.component.html',
  styleUrl: './presentation-page.component.css'
})
export class PresentationPageComponent {

  constructor(private router: Router){}

  navigateToAuth(){
    this.router.navigate(['/Login']);
  }
}
