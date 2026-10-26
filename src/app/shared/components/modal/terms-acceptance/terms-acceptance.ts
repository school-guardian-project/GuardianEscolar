import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface MinorInfo {
  profileId: string;
  name: string;
}

@Component({
  selector: 'app-terms-acceptance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './terms-acceptance.html',
  styleUrl: './terms-acceptance.css',
})
export class TermsAcceptance {
  @Input() minors: MinorInfo[] = [];
  @Input() termsVersion = '2026.08';
  @Output() accepted = new EventEmitter<{ termsVersion: string; minorProfileIds: string[] }>();
  @Output() closed = new EventEmitter<void>();

  acceptedCheckbox = false;
  showTerms = false;
  showPrivacy = false;

  TERMS_SECTIONS = [
    { title: 'legal.terms.titleObject', body: 'legal.terms.descriObject' },
    { title: 'legal.terms.titleAcceptance', body: 'legal.terms.descriAcceptance' },
    { title: 'legal.terms.titleRoles', body: 'legal.terms.descriRoles' },
    { title: 'legal.terms.titleProperUse', body: 'legal.terms.descriProperUse' },
    { title: 'legal.terms.titleLocation', body: 'legal.terms.descriLocation' },
    { title: 'legal.terms.titleQr', body: 'legal.terms.descriQr' },
    { title: 'legal.terms.titleLiability', body: 'legal.terms.descriLiability' },
    { title: 'legal.terms.titleAccounts', body: 'legal.terms.descriAccounts' },
    { title: 'legal.terms.titleContact', body: 'legal.terms.descriContact' },
  ];

  PRIVACY_SECTIONS = [
    { title: 'legal.privacy.titleDatas', body: 'legal.privacy.descriDatas' },
    { title: 'legal.privacy.titleProtection', body: 'legal.privacy.descriProtection' },
    { title: 'legal.privacy.titleAccess', body: 'legal.privacy.descriAccess' },
    { title: 'legal.privacy.titleElimination', body: 'legal.privacy.descriElimination' },
    { title: 'legal.privacy.titleLaws', body: 'legal.privacy.descriLaws' },
  ];

  onAccept(): void {
    if (!this.acceptedCheckbox) return;

    const minorProfileIds = this.minors.map((m) => m.profileId);
    this.accepted.emit({ termsVersion: this.termsVersion, minorProfileIds });
    this.acceptedCheckbox = false;
  }

  onClose(): void {
    this.closed.emit();
    this.acceptedCheckbox = false;
  }

  toggleTerms(): void {
    this.showTerms = !this.showTerms;
    this.showPrivacy = false;
  }

  togglePrivacy(): void {
    this.showPrivacy = !this.showPrivacy;
    this.showTerms = false;
  }

  getMinorsText(): string {
    const count = this.minors.length;
    if (count === 0) return '';
    if (count === 1) return `Esta autorización cubre a 1 menor a tu cargo.`;
    return `Esta autorización cubre a ${count} menores a tu cargo.`;
  }
}