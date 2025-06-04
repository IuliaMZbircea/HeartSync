import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-view-consultations',
  standalone: true,
  imports: [],
  templateUrl: './view-consultations.component.html',
  styleUrl: './view-consultations.component.css'
})
export class ViewConsultationsComponent implements OnInit {
  patientId?: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') ?? undefined;

  }
}
