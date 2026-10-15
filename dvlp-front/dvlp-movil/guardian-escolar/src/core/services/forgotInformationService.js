import { apiRequestAt } from "./apiClient";

const API_URL = (process.env.EXPO_PUBLIC_FORGOT_INFORMATION_API_URL || "").replace(/\/+$/, "");

let passwordEmail = null;
let passwordResetToken = null;

let currentEmail = null;
let currentEmailResetToken = null;
let newEmail = null;
let newEmailResetToken = null;

let phoneEmail = null;
let currentPhone = null;
let phoneResetToken = null;
let newPhone = null;

async function post(path, body) {
  if (!API_URL) {
    throw new Error("Falta EXPO_PUBLIC_FORGOT_INFORMATION_API_URL en .env.");
  }

  return apiRequestAt(API_URL, path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

const DEFAULT_COUNTRY_CODE = "+57";

export function normalizePhone(phone) {
  let digits = String(phone ?? "").replace(/[\s\-().]/g, "");
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
  if (digits.startsWith("+")) return digits;
  return `${DEFAULT_COUNTRY_CODE}${digits.replace(/^0+/, "")}`;
}

export function clearPasswordReset() {
  passwordEmail = null;
  passwordResetToken = null;
}

let passwordIsChange = false;

export async function requestPasswordReset(email, isPasswordChange = false) {
  const normalizedEmail = normalizeEmail(email);
  await post("/api/v1/password/forgot", { email: normalizedEmail, isPasswordChange });
  passwordIsChange = isPasswordChange;
  passwordEmail = normalizedEmail;
  passwordResetToken = null;
}

export function resendPasswordResetCode() {
  if (!passwordEmail) {
    throw new Error("Primero debes solicitar la recuperación de contraseña.");
  }
  return requestPasswordReset(passwordEmail, passwordIsChange);
}

export async function verifyPasswordResetCode(code) {
  if (!passwordEmail) {
    throw new Error("Primero debes solicitar la recuperación de contraseña.");
  }

  const result = await post("/api/v1/password/forgot/verify", {
    email: passwordEmail,
    code,
  });
  passwordResetToken = result.resetToken;
}

export async function resetPassword(newPassword, confirmPassword) {
  if (!passwordEmail || !passwordResetToken) {
    throw new Error("Debes verificar el código antes de cambiar la contraseña.");
  }

  await post("/api/v1/password/reset", {
    email: passwordEmail,
    resetToken: passwordResetToken,
    newPassword,
    confirmPassword,
  });
  clearPasswordReset();
}

export function clearEmailChange() {
  currentEmail = null;
  currentEmailResetToken = null;
  newEmail = null;
  newEmailResetToken = null;
}

export async function requestEmailChange(email) {
  const normalizedEmail = normalizeEmail(email);
  await post("/api/v1/email/change/request", { email: normalizedEmail });
  currentEmail = normalizedEmail;
  currentEmailResetToken = null;
  newEmail = null;
  newEmailResetToken = null;
}

export function resendCurrentEmailCode() {
  if (!currentEmail) {
    throw new Error("Primero debes solicitar el cambio de correo.");
  }
  return requestEmailChange(currentEmail);
}

export async function verifyCurrentEmailCode(code) {
  if (!currentEmail) {
    throw new Error("Primero debes solicitar el cambio de correo.");
  }

  const result = await post("/api/v1/email/change/verify", {
    email: currentEmail,
    code,
  });
  currentEmailResetToken = result.resetToken;
}

export async function submitNewEmail(email) {
  if (!currentEmail || !currentEmailResetToken) {
    throw new Error("Debes verificar el correo actual antes de continuar.");
  }

  const normalizedEmail = normalizeEmail(email);
  await post("/api/v1/email/change/new", {
    email: currentEmail,
    resetToken: currentEmailResetToken,
    newEmail: normalizedEmail,
  });
  newEmail = normalizedEmail;
  currentEmailResetToken = null;
  newEmailResetToken = null;
}

export function resendNewEmailCode() {
  if (!currentEmail || !newEmail) {
    throw new Error("Primero debes solicitar el cambio al nuevo correo.");
  }
  return post("/api/v1/email/change/resend-new", { email: currentEmail });
}

export async function verifyNewEmailCode(code) {
  if (!currentEmail || !newEmail) {
    throw new Error("Primero debes solicitar el cambio al nuevo correo.");
  }

  const result = await post("/api/v1/email/change/verify-new", {
    email: currentEmail,
    code,
  });
  newEmailResetToken = result.resetToken;
}

export async function confirmEmailChange() {
  if (!currentEmail || !newEmailResetToken) {
    throw new Error("Debes verificar el código enviado al nuevo correo.");
  }

  await post("/api/v1/email/change/confirm", {
    email: currentEmail,
    resetToken: newEmailResetToken,
  });
  const confirmedEmail = newEmail;
  clearEmailChange();
  return confirmedEmail;
}

export function clearPhoneChange() {
  phoneEmail = null;
  currentPhone = null;
  phoneResetToken = null;
  newPhone = null;
}

export async function requestPhoneChange(email, phone) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  await post("/api/v1/phone/change/request", {
    email: normalizedEmail,
    currentPhone: normalizedPhone,
  });
  phoneEmail = normalizedEmail;
  currentPhone = normalizedPhone;
  phoneResetToken = null;
  newPhone = null;
}

export function resendCurrentPhoneCode() {
  if (!phoneEmail || !currentPhone) {
    throw new Error("Primero debes solicitar el cambio de teléfono.");
  }
  return requestPhoneChange(phoneEmail, currentPhone);
}

export async function verifyCurrentPhoneCode(code) {
  if (!phoneEmail || !currentPhone) {
    throw new Error("Primero debes solicitar el cambio de teléfono.");
  }

  const result = await post("/api/v1/phone/change/verify", {
    email: phoneEmail,
    currentPhone,
    code,
  });
  phoneResetToken = result.resetToken;
}

export async function requestNewPhoneCode(phone) {
  if (!phoneEmail || !phoneResetToken) {
    throw new Error("Debes verificar tu teléfono actual antes de continuar.");
  }

  const normalizedPhone = normalizePhone(phone);
  await post("/api/v1/phone/change/verification/request", {
    email: phoneEmail,
    resetToken: phoneResetToken,
    newPhone: normalizedPhone,
  });
  newPhone = normalizedPhone;
  phoneResetToken = null;
}

export function resendNewPhoneCode() {
  if (!phoneEmail || !newPhone) {
    throw new Error("Primero debes solicitar el código para el nuevo teléfono.");
  }
  return post("/api/v1/phone/change/verification/resend", {
    email: phoneEmail,
    newPhone,
  });
}

export async function verifyNewPhoneCode(code) {
  if (!phoneEmail || !newPhone) {
    throw new Error("Primero debes solicitar el código para el nuevo teléfono.");
  }

  await post("/api/v1/phone/change/verification/check", {
    email: phoneEmail,
    newPhone,
    code,
  });
  clearPhoneChange();
}

export function serviceErrorKey(error, context = "request") {
  const code = error?.data?.code;
  if (code === "account_not_found") return "serviceErrors.accountNotFound";
  if (code === "phone_mismatch") return "serviceErrors.phoneMismatch";
  if (code === "delivery_failed") return "serviceErrors.deliveryFailed";
  if (error?.status === 429) return "serviceErrors.rateLimited";
  if (error?.status === 503) return "serviceErrors.deliveryFailed";
  if (error?.status === 409) return "serviceErrors.emailInUse";
  if (error?.status === 400) {
    if (context === "email") return "serviceErrors.invalidEmail";
    if (context === "phone") return "serviceErrors.invalidPhone";
    if (context === "phoneFlow" || context === "emailFlow" || context === "password") {
      return "serviceErrors.flowExpired";
    }
    return "serviceErrors.invalidCode";
  }
  return "serviceErrors.requestFailed";
}
