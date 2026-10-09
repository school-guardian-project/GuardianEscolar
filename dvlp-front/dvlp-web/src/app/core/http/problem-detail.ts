import { HttpErrorResponse } from '@angular/common/http';

/**
 * Mensaje accionable de un error ProblemDetails (el que devuelven todos los
 * microservicios).
 *
 * Para quien registra, el `detail`/`title` del backend dice mucho más que un
 * genérico "no se pudo registrar": si mandó un campusId que no existe, el
 * backend responde exactamente eso. Se usa solo para mostrar; el código de
 * error para decidir en lógica sigue siendo `e.status`.
 */
export function describeProblem(err: unknown, fallback: string): string {
  if (!(err instanceof HttpErrorResponse) || err.error == null) {
    return fallback;
  }

  const body = err.error;
  if (typeof body !== 'object') {
    return fallback;
  }

  // ApiErrors.ToProblem: use-case errors con `title` y `detail` accionables.
  // La validación de [ApiController] de ASP.NET no manda `detail`, manda
  // `errors: { Campo: ["..."] }`; se recoge la primera de esas frases.
  const detail = body.detail;
  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }

  const errors = body.errors as Record<string, unknown> | undefined;
  if (errors) {
    const entries = Object.entries(errors);
    const prioritizedEntries = [
      ...entries.filter(([fieldName]) => fieldName.toLowerCase() !== 'request'),
      ...entries.filter(([fieldName]) => fieldName.toLowerCase() === 'request'),
    ];
    for (const [fieldName, field] of prioritizedEntries) {
      if (Array.isArray(field)) {
        const first = field.find((m): m is string => typeof m === 'string' && m.trim().length > 0);
        if (first) return `${fieldName}: ${first}`;
      }
    }
  }

  const title = body.title ?? body.message;
  if (typeof title === 'string' && title.trim()) {
    return title;
  }

  return fallback;
}