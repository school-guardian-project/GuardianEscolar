import { Injectable } from '@angular/core';

/**
 * Estado transitorio del flujo de cambio de contraseña.
 *
 * El backend (`POST /api/v1/auth/change-password`) exige la contraseña actual
 * junto a la nueva en un único request, pero la UI la captura en un paso
 * anterior. Se guarda aquí, en memoria, únicamente entre pasos: nada de
 * sessionStorage/localStorage — una contraseña no se persiste jamás.
 */
@Injectable({ providedIn: 'root' })
export class ChangePasswordStateService {
  currentPassword: string | null = null;

  reset(): void {
    this.currentPassword = null;
  }
}