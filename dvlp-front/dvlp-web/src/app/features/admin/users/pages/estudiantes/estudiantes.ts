// estudiantes.ts — ejemplo de integración con app-update-record
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '@shared/components/cards/card-register/card-register';
import { CardList } from '@shared/components/cards/card-list/card-list';
import { NavbarAdmin } from '@shared/components/navbar/navbar-admin/navbar-admin';
import { RecordInformation, RecordData } from '@shared/components/modal/record-information/record-information';
import { UpdateRecord } from '@shared/components/modal/update-record/update-record';
import { DeleteRecord } from '@shared/components/modal/delete-record/delete-record';
import { StudentService } from '@core/services/user-management/student.service';
import { StudentRequest, StudentResponse } from '@core/models/user-management/student.model';
import { ApiService } from '@core/services/api.service';
import { CourseResponse } from '@core/models/school-management/course.model';
import { IdentificationTypeResponse } from '@core/models/user-management/identification-type.model';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [
    RouterModule,
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
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.scss',
})
export class Estudiantes implements OnInit {

  students: StudentResponse[] = [];
  identificationTypes: IdentificationTypeResponse[] = [];
  courses: CourseResponse[] = [];

  selectOptions: Record<string, string[]> = { tipoId: [], curso: [] };
  
  constructor(private studentService: StudentService, private api: ApiService) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadIdentificationType();
    this.loadCourses();
  }

  private loadIdentificationType(): void {
    this.api.getAll<IdentificationTypeResponse>('identification-type').subscribe({
      next: (data: IdentificationTypeResponse[]) => {
        this.identificationTypes = data, 
        this.updateSelectOptions();
      },
      error: (error: any) => console.error('Error cargando tipos de identificacion: ', error)
    });
  }

  private loadCourses(): void {
    this.api.getAll<CourseResponse>('course').subscribe({
      next: (data: CourseResponse[]) => {
         this.courses = data,
         this.updateSelectOptions();
      },
      error: (error: any) => console.error('Error cargando cursos: ', error)
    });
  }

  private updateSelectOptions(): void {
    this.selectOptions = {
      tipoId: this.identificationTypes.map(t => t.name),
      curso: this.courses.map(c => c.name)
    }
  }

  private loadStudents(): void {
    this.studentService.getAll().subscribe({
      next: (data: StudentResponse[]) => {
        console.log(data);
        this.students = data;
      },
      error: (error: any) => {
        console.error('Error al cargar estudiantes: ', error);
      }
    });
  }

  // -- Registrar nuevo estudiante (COnsumir Web Api)
  private mapToStudentRequest(data: Record<string, any>): StudentRequest {
    const idType = this.identificationTypes.find(t => t.name == data['tipoId']);
    const course = this.courses.find(c => c.name == data['curso'])
    
    return {
      name: data['nombres'],
      lastName: data['apellidos'],
      identificationId: idType?.id ?? '',
      identificationNumber: data['identificacion'],
      email: data['correo'],
      phone: data['telefono'],
      residenceAddress: data['direccion'],
      password: data['contraseña'],
      courseId: course?.id ?? '',
    }
  }

  onRegister(data: Record<string, any>): void {
    const request = this.mapToStudentRequest(data);

    const idType = this.identificationTypes.find(t => t.name === data['tipoId']);
    if (!idType) {
      console.error('Tipo de identificación no válido');
      return;
    }

    const course = this.courses.find(c => c.name === data['curso']);
    if (!course) {
      console.error('Curso no válido');
      return;
    }

    this.studentService.create(request).subscribe({
      next: (response: StudentResponse) => {
        console.log('Estudiante creado: ', response);
        this.loadStudents();
      },
      error: (error: any) => {
        console.error('Error al crear estudiante: ', error);
      }
    })
  }

  // ── Ver detalles 
  showModal = false;
  studentSelected: RecordData = {};

  showDetails(student: RecordData): void {
    this.studentSelected = student;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.studentSelected = {};
  }

  // ── Actualizar registro ─────────────────────────────────────────────────
  showUpdateModal = false;

  showUpdate(student: RecordData): void {
    this.studentSelected = student;
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.studentSelected = {};
  }

  /**
   * Recibe los datos ya actualizados del formulario.
   * Aquí puedes llamar a tu servicio para persistirlos.
   */
  onSaved(updatedRecord: RecordData): void {
    console.log('[Estudiantes] Datos actualizados:', updatedRecord);
    // this.estudiantesService.update(updatedRecord).subscribe(() => { ... });
    this.closeUpdateModal();
  }

  // ── Eliminar registro ───────────────────────────────────────────────────
  showDeleteModal = false;

  showDelete(student: RecordData): void {
    this.studentSelected = student;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.studentSelected = {};
  }

  /**
   * Confirma la eliminación del registro.
   * Aquí puedes llamar a tu servicio para eliminar.
   */
  onConfirmDelete(record: RecordData): void {
    console.log('[Estudiantes] Eliminando:', record);
    // this.estudiantesService.delete(record.id).subscribe(() => { ... });
    this.closeDeleteModal();
  }
}