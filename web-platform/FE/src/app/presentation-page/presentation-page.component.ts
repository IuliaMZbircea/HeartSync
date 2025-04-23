import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-presentation-page',
  standalone: true,
  imports: [],
  templateUrl: './presentation-page.component.html',
  styleUrl: './presentation-page.component.css'
})
export class PresentationPageComponent {

  constructor(private router: Router){}

  navigateToAuth(){
    this.router.navigate(['/Login']);
  }
}
