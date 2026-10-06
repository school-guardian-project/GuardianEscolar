import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { forkJoin } from 'rxjs';

import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '@shared/components/cards/card-register/card-register';
import { NavbarAdmin } from '@shared/components/navbar/navbar-admin/navbar-admin';
import { CardList } from '@shared/components/cards/card-list/card-list';
import { RecordInformation, RecordData } from '@shared/components/modal/record-information/record-information';
import { UpdateRecord } from '@shared/components/modal/update-record/update-record';
import { DeleteRecord } from '@shared/components/modal/delete-record/delete-record';
import { FamiliesService } from '@core/services/families.service';
import { ParentsService } from '@core/services/parents.service';
import { StudentsService } from '@core/services/students.service';
import { FamilyListDto, FamilyMemberDto, FamilyRequestDto, FamilyResponseDto } from '@core/models/family.model';
import { PersonListDto } from '@core/models/student.model';
import { describeProblem } from '@core/http/problem-detail';

interface FamilyView extends RecordData {
  id?: string;
  name: string;
  guardian: string;
  student: string;
  observations: string;
  phone: string;
}

function labelOf(person: PersonListDto): string {
  return `${person.name ?? ''} ${person.lastName ?? ''}`.trim();
}

@Component({
  selector: 'app-families',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    CommonModule,
    NavbarManage,
    CardRegister,
    CardList,
    NavbarAdmin,
    RecordInformation,
    UpdateRecord,
    DeleteRecord,
  ],
  templateUrl: './families.html',
  styleUrl: './families.scss',
})
export class Families implements OnInit {
  private familiesService = inject(FamiliesService);
  private parentsService = inject(ParentsService);
  private studentsService = inject(StudentsService);

  @ViewChild(CardRegister) register?: CardRegister;

  families = signal<FamilyView[]>([]);
  fieldOptions: Record<string, string[]> = {};

  /** Claves de resolución: profileId (lo que guardan las familias) y person.id (datos
   *  heredados). El envío usa profileId, que es lo que espera el DTO de miembros. */
  private parentLabelById = new Map<string, string>();
  private parentIdByLabel = new Map<string, string>();
  private parentPhoneById = new Map<string, string>();
  private studentLabelById = new Map<string, string>();
  private studentIdByLabel = new Map<string, string>();

  /** Miembros del detalle abierto: se conservan al editar. */
  private detail: FamilyResponseDto | null = null;

  ngOnInit(): void {
    forkJoin({
      parents: this.parentsService.list(),
      students: this.studentsService.list(),
    }).subscribe({
      next: ({ parents, students }) => {
        for (const parent of parents) {
          const label = labelOf(parent);
          const phone = parent.phone != null ? String(parent.phone) : '';
          for (const key of [parent.id, parent.profileId ?? '']) {
            if (!key) continue;
            this.parentLabelById.set(key, label);
            this.parentPhoneById.set(key, phone);
          }
          this.parentIdByLabel.set(label, parent.profileId ?? parent.id);
        }
        for (const student of students) {
          const label = labelOf(student);
          this.studentLabelById.set(student.id, label);
          if (student.profileId) this.studentLabelById.set(student.profileId, label);
          this.studentIdByLabel.set(label, student.profileId ?? student.id);
        }
        this.fieldOptions = {
          guardian: [...this.parentIdByLabel.keys()],
          student: [...this.studentIdByLabel.keys()],
        };
        this.load();
      },
    });
  }

  private load(): void {
    this.familiesService.list().subscribe({
      next: (list) => this.families.set(list.map((api) => this.fromApi(api))),
    });
  }

  onSearch(term: string): void {
    const query = term.trim();
    if (!query) {
      this.load();
      return;
    }
    this.familiesService.search(query).subscribe({
      next: (list) => this.families.set(list.map((api) => this.fromApi(api))),
    });
  }

  private fromApi(api: FamilyListDto): FamilyView {
    const parentId = api.parentProfileId ?? '';
    return {
      id: api.id,
      name: api.name ?? '',
      guardian: this.parentLabelById.get(parentId) ?? '',
      student: '',
      observations: '',
      phone: this.parentPhoneById.get(parentId) ?? '',
    };
  }

  private fromDetail(api: FamilyResponseDto): FamilyView {
    return {
      ...this.fromApi(api),
      student: (api.children ?? [])
        .map((id) => this.studentLabelById.get(id) ?? '')
        .filter(Boolean)
        .join(', '),
      observations: api.description ?? '',
    };
  }

  private toPayload(form: RecordData, keepChildren: string[] = []): FamilyRequestDto | null {
    const parentLabel = String(form['guardian'] ?? '').trim();
    const parentId = this.parentIdByLabel.get(parentLabel) ?? parentLabel;

    const selected = form['student'] as unknown;
    const studentLabels = Array.isArray(selected)
      ? selected.map((value) => String(value).trim())
      : String(selected ?? '')
          .split(',')
          .map((value) => value.trim());

    const children = [
      ...new Set([
        ...keepChildren,
        ...studentLabels
          .map((label) => this.studentIdByLabel.get(label) ?? label)
          .filter((id) => id && id !== parentId),
      ]),
    ];

    const members: FamilyMemberDto[] = [];
    if (parentId) {
      members.push({ profileId: parentId, relationshipType: 'Parent' });
    }
    members.push(
      ...children.map(
        (profileId): FamilyMemberDto => ({ profileId, relationshipType: 'Student' }),
      ),
    );

    if (!String(form['name'] ?? '').trim() || members.length === 0) {
      return null;
    }

    return {
      familyName: String(form['name'] ?? '').trim(),
      observations: String(form['observations'] ?? '').trim(),
      members,
    };
  }

  onCreated(form: RecordData): void {
    const payload = this.toPayload(form);
    if (!payload) {
      this.register?.setValidationMessage(
        'Selecciona el nombre de la familia, el acudiente y al menos un estudiante.'
      );
      return;
    }

    this.familiesService.create(payload).subscribe({
      next: () => {
        this.register?.setValidationMessage('');
        this.register?.resetForm();
        this.load();
      },
      error: (err) => {
        this.register?.setValidationMessage(
          describeProblem(err, 'No se pudo registrar la familia. Verifica que el backend esté disponible.')
        );
      },
    });
  }

  showModal = false;
  familySelected: RecordData = {};

  showDetails(family: RecordData): void {
    const id = family['id'];
    if (!id) {
      return;
    }
    this.familiesService.get(String(id)).subscribe({
      next: (detail) => {
        this.detail = detail;
        this.familySelected = this.fromDetail(detail);
        this.showModal = true;
      },
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.familySelected = {};
    this.detail = null;
  }

  showUpdateModal = false;
  familyToUpdate: RecordData = {};

  showUpdate(family: RecordData): void {
    const id = family['id'];
    if (!id) {
      return;
    }
    this.familiesService.get(String(id)).subscribe({
      next: (detail) => {
        this.detail = detail;
        const view = this.fromDetail(detail);
        // El modal de actualización tiene un solo select de estudiante.
        const firstChild = (detail.children ?? [])[0];
        this.familyToUpdate = {
          ...view,
          student: firstChild ? (this.studentLabelById.get(firstChild) ?? firstChild) : '',
        };
        this.showUpdateModal = true;
      },
    });
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.familyToUpdate = {};
    this.detail = null;
  }

  onSaved(updatedRecord: RecordData): void {
    const id = updatedRecord['id'];
    if (!id) {
      this.closeUpdateModal();
      return;
    }

    const payload = this.toPayload(updatedRecord, this.detail?.children ?? []);
    if (!payload) {
      return;
    }

    this.familiesService.update(String(id), payload).subscribe({
      next: () => {
        this.closeUpdateModal();
        this.load();
      },
    });
  }

  showDeleteModal = false;

  showDelete(family: RecordData): void {
    if (!family['id']) {
      return;
    }
    this.familySelected = family;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.familySelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    const id = record['id'];
    if (!id) {
      this.closeDeleteModal();
      return;
    }

    this.familiesService.remove(String(id)).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.load();
      },
    });
  }
}
