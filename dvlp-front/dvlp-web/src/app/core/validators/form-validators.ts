export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: 'email' | 'phone' | 'number' | 'text' | 'url';
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

export type ValidationSchema = Record<string, ValidationRule>;

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_PATTERN = /^[0-9]{7,15}$/;

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`);
    return (url.protocol === 'http:' || url.protocol === 'https:') && !!url.hostname;
  } catch {
    return false;
  }
}

export function validateField(value: any, rule: ValidationRule): string | null {
  const str = String(value ?? '').trim();

  if (rule.required && !str) {
    return 'Este campo es requerido';
  }

  if (!str) return null;

  if (rule.minLength && str.length < rule.minLength) {
    return `Mínimo ${rule.minLength} caracteres`;
  }

  if (rule.maxLength && str.length > rule.maxLength) {
    return `Máximo ${rule.maxLength} caracteres`;
  }

  if (rule.pattern === 'email' && !EMAIL_PATTERN.test(str)) {
    return 'Correo electrónico inválido';
  }

  if (rule.pattern === 'url' && !isValidUrl(str)) {
    return 'URL inválida';
  }

  if (rule.pattern === 'phone' && !PHONE_PATTERN.test(str)) {
    return 'Teléfono inválido (solo números, 7-15 dígitos)';
  }

  if (rule.pattern === 'number') {
    const num = Number(str);
    if (isNaN(num)) return 'Debe ser un número';
    if (rule.min !== undefined && num < rule.min) return `Mínimo ${rule.min}`;
    if (rule.max !== undefined && num > rule.max) return `Máximo ${rule.max}`;
  }

  if (rule.pattern === 'text' && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(str)) {
    return 'Solo letras y espacios';
  }

  if (rule.custom) {
    return rule.custom(value);
  }

  return null;
}

export function validateForm(
  data: Record<string, any>,
  schema: ValidationSchema,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, rule] of Object.entries(schema)) {
    const error = validateField(data[field], rule);
    if (error) errors[field] = error;
  }

  return errors;
}

export function validateBirthDate(value: string): string | null {
  if (!value) return 'Este campo es requerido';

  const date = new Date(value);
  const now = new Date();
  const minDate = new Date();
  minDate.setFullYear(now.getFullYear() - 100);

  if (date > now) return 'La fecha no puede ser futura';
  if (date < minDate) return 'La fecha no puede ser anterior a hace 100 años';

  return null;
}

export function validateFutureDate(value: string): string | null {
  if (!value) return 'Este campo es requerido';

  const date = new Date(value);
  const now = new Date();

  if (date < now) return 'La fecha debe ser futura';

  return null;
}
