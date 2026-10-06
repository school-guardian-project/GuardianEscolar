export function validateRequired(value, message = "Este campo es obligatorio") {
  return value.trim() ? "" : message;
}

export function validateEmail(value) {
  const requiredError = validateRequired(value, "Ingresa tu correo electrónico");

  if (requiredError) {
    return requiredError;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ? ""
    : "Ingresa un correo electrónico válido";
}

export function validatePhone(value) {
  const requiredError = validateRequired(value);

  if (requiredError) {
    return requiredError;
  }

  const phoneDigits = value.trim().replace(/[\s-]/g, "");

  return /^\+?\d{7,15}$/.test(phoneDigits)
    ? ""
    : "Ingresa un número telefónico válido";
}
