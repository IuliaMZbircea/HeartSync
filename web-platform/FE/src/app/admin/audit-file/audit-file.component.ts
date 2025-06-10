import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgForOf} from "@angular/common";
import {MatIconAnchor, MatIconButton} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-audit-file',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgForOf,
    MatIconAnchor,
    MatIconModule
  ],
  templateUrl: './audit-file.component.html',
  styleUrl: './audit-file.component.css'
})
export class AuditFileComponent {
  folders = [
    { name: 'PATIENT', route: '/audit-patients', icon: 'folder' },
    { name: 'ALARM', route: '/audit-alarms', icon: 'folder' },
    { name: 'ALLERGY', route: '/audit-allergies', icon: 'folder' },
    { name: 'REFERRAL', route: '/audit-referrals', icon: 'folder' },
    { name: 'RECOMMENDATION', route: '/audit-recommendations', icon: 'folder' },
    { name: 'CONSULTATION', route: '/audit-consultations', icon: 'folder' },
    { name: 'MEDICATION', route: '/audit-medications', icon: 'folder' }

  ];

}
