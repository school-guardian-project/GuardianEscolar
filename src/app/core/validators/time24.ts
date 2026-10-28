/** Horario militar (24 h, HH:mm). Evita el selector AM/PM del navegador. */
export const TIME24_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Deja solo dígitos y coloca los dos puntos: "0830" -> "08:30". */
export function formatTime24Input(raw: unknown): string {
  const digits = String(raw ?? '').replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
}

export function isValidTime24(value: unknown): boolean {
  return TIME24_PATTERN.test(String(value ?? '').trim());
}
