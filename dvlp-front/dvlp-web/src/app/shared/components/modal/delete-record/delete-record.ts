import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RecordData, RegisterType } from '@shared/components/modal/record-information/record-information';

const DELETE_CONFIG: Record<RegisterType, { title: string; icon: string; text: string }> = {
  estudiante: {
    title: 'Eliminar Estudiante',
    icon: 'person',
    text: '¿Deseas eliminar este estudiante? Esta acción no se puede deshacer.',
  },
  acudiente: {
    title: 'Eliminar Acudiente',
    icon: 'people',
    text: '¿Deseas eliminar este acudiente? Esta acción no se puede deshacer.',
  },
  conductor: {
    title: 'Eliminar Conductor',
    icon: 'directions_car',
    text: '¿Deseas eliminar este conductor? Esta acción no se puede deshacer.',
  },
  familia: {
    title: 'Eliminar Familia',
    icon: 'family_restroom',
    text: '¿Deseas eliminar esta familia? Esta acción no se puede deshacer.',
  },
  bus: {
    title: 'Eliminar Bus',
    icon: 'directions_bus',
    text: '¿Deseas eliminar este bus? Esta acción no se puede deshacer.',
  },
  parada: {
    title: 'Eliminar Parada',
    icon: 'location_on',
    text: '¿Deseas eliminar esta parada? Esta acción no se puede deshacer.',
  },
  ruta: {
    title: 'Eliminar Ruta',
    icon: 'route',
    text: '¿Deseas eliminar esta ruta? Esta acción no se puede deshacer.',
  },
  admins: {
    title: 'Eliminar Administrador',
    icon: 'admin_panel_settings',
    text: '¿Deseas eliminar este administrador? Esta acción no se puede deshacer.',
  },
  schools: {
    title: 'Eliminar Escuela',
    icon: 'school',
    text: '¿Deseas eliminar esta escuela? Esta acción no se puede deshacer.',
  },
};

@Component({
  selector: 'app-delete-record',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './delete-record.html',
  styleUrl: './delete-record.css',
})
export class DeleteRecord {
  @Input() type: RegisterType = 'estudiante';
  @Input() record: RecordData = {};
  @Output() confirm = new EventEmitter<RecordData>();
  @Output() cancel = new EventEmitter<void>();

  get config() {
    return DELETE_CONFIG[this.type];
  }

  get displayName(): string {
    return (
      (this.record['nombres'] as string) ||
      (this.record['nombre'] as string) ||
      (this.record['correo'] as string) ||
      'Registro'
    );
  }

  close(): void {
    this.cancel.emit();
  }

  confirmDelete(): void {
    this.confirm.emit(this.record);
  }
}

