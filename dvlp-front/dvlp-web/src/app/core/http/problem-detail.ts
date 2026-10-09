import { HttpErrorResponse } from '@angular/common/http';

/**
 * Mensaje accionable de un error ProblemDetails (el que devuelven todos los
 * microservicios).
 *
 * Los mensajes conocidos del backend se traducen a una clave i18n y los
 * mensajes técnicos (deserialización JSON, trazas, SQL) se reemplazan por el
 * `fallback`: el usuario no debe ver "$.startTime: The JSON value could not be
 * converted to System.TimeOnly".
 */
type Translator = (key: string) => string;

let translator: Translator = (key) => key;

/** La registra App al arrancar para que esta función pura pueda traducir. */
export function setProblemTranslator(fn: Translator): void {
  translator = fn;
}

interface KnownProblem {
  pattern: RegExp;
  key: string;
  /** Campo del formulario al que pertenece el error, si aplica. */
  field?: string;
}

const KNOWN_PROBLEMS: KnownProblem[] = [
  { pattern: /plate already exists/i, key: 'errors.backend.plateExists', field: 'plate' },
  { pattern: /plate is required/i, key: 'errors.backend.plateRequired', field: 'plate' },
  { pattern: /gps device already assigned/i, key: 'errors.backend.gpsAssigned', field: 'gps' },
  { pattern: /gps device (not found|does not exist)|invalid imei/i, key: 'errors.backend.gpsNotFound', field: 'gps' },
  { pattern: /driver/i, key: 'errors.backend.driver', field: 'driver' },
  { pattern: /route not found|route .*inactive/i, key: 'errors.backend.routeNotFound', field: 'route' },
  { pattern: /bus not found/i, key: 'errors.backend.busNotFound' },
  { pattern: /stop not found/i, key: 'errors.backend.stopNotFound' },
  { pattern: /campus/i, key: 'errors.backend.campus', field: 'campus' },
  { pattern: /starttime/i, key: 'errors.backend.invalidTime', field: 'startTime' },
  { pattern: /endtime/i, key: 'errors.backend.invalidTime', field: 'endTime' },
  { pattern: /already exists|duplicate/i, key: 'errors.backend.duplicate' },
];

const TECHNICAL = /\$\.|JSON value|System\.|Exception|stack|SqlException|could not be converted|at [\w.]+\(|One or more validation errors/i;

function rawMessages(err: unknown): string[] {
  if (!(err instanceof HttpErrorResponse) || err.error == null) return [];
  const body = err.error;
  if (typeof body === 'string') return body.trim() ? [body.trim()] : [];
  if (typeof body !== 'object') return [];

  const messages: string[] = [];
  if (typeof body.detail === 'string' && body.detail.trim()) messages.push(body.detail.trim());

  const errors = body.errors as Record<string, unknown> | undefined;
  if (errors) {
    for (const [fieldName, field] of Object.entries(errors)) {
      if (Array.isArray(field)) {
        const first = field.find((m): m is string => typeof m === 'string' && m.trim().length > 0);
        if (first) messages.push(`${fieldName}: ${first}`);
      }
    }
  }

  const title = body.title ?? body.message;
  if (typeof title === 'string' && title.trim()) messages.push(title.trim());
  return messages;
}

function findKnown(err: unknown): KnownProblem | null {
  for (const message of rawMessages(err)) {
    const known = KNOWN_PROBLEMS.find((k) => k.pattern.test(message));
    if (known) return known;
  }
  return null;
}

function translated(key: string): string | null {
  const text = translator(key);
  return text && text !== key ? text : null;
}

export function describeProblem(err: unknown, fallback: string): string {
  const known = findKnown(err);
  if (known) {
    const text = translated(known.key);
    if (text) return text;
  }

  if (err instanceof HttpErrorResponse && err.status === 0) {
    return translated('errors.backend.unavailable') ?? fallback;
  }

  // Un mensaje en español/inglés legible del backend sí aporta; uno técnico no.
  const readable = rawMessages(err).find((m) => !TECHNICAL.test(m) && !/^(Bad Request|Not Found|Conflict|Internal Server Error)$/i.test(m));
  return readable ?? fallback;
}

/** Campo del formulario al que apunta el error del backend (o null). */
export function problemField(err: unknown): string | null {
  return findKnown(err)?.field ?? null;
}
