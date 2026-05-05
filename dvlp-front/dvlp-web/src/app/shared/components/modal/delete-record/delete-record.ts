import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { RecordData, RegisterType } from '@shared/components/modal/record-information/record-information.types';

const DELETE_CONFIG: Record<RegisterType, { icon: string }> = {
  estudiante: { icon: 'person' },
  acudiente: { icon: 'people' },
  conductor: { icon: 'directions_car' },
  familia: { icon: 'family_restroom' },
  bus: { icon: 'directions_bus' },
  parada: { icon: 'location_on' },
  ruta: { icon: 'route' },
  admins: { icon: 'admin_panel_settings' },
  schools: { icon: 'school' },
};

@Component({
  selector: 'app-delete-record',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
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


  get titleKey(): string {
    return `delete_record.${this.type}.title`;
  }

  get textKey(): string {
    return `delete_record.${this.type}.text`;
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