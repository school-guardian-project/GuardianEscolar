import { HttpErrorResponse } from '@angular/common/http';

/** Cuerpo de error del microservicio de recuperación: `code` es estable, `message` va en español. */
interface BackendError {
  code?: string | null;
}

/**
 * Traduce un fallo al pedir un código (correo o SMS) a la clave i18n que explica por qué no se envió.
 * `badRequestKey` cubre el 400 genérico (formato inválido) de cada pantalla.
 */
export function requestErrorKey(error: unknown, badRequestKey: string): string {
  const status = error instanceof HttpErrorResponse ? error.status : 0;
  const code = ((error as HttpErrorResponse | undefined)?.error as BackendError | null | undefined)?.code;

  if (code === 'account_not_found') return 'forgot_password.errors.account_not_found';
  if (code === 'phone_mismatch') return 'forgot_password.errors.phone_mismatch';
  if (status === 429) return 'forgot_password.errors.rate_limited';
  if (status === 503 || code === 'delivery_failed') return 'forgot_password.errors.delivery_failed';
  if (status === 400) return badRequestKey;
  return 'forgot_password.errors.request_failed';
}