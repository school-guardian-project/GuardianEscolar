import { apiGet, apiPost } from "./apiClient";
import { getSession } from "./authService";
import { getLinkedStudents, PARENT_ROLE_ID } from "./familyService";

/** Versión vigente de los Términos. Debe coincidir con el documento legal publicado. */
export const CURRENT_TERMS_VERSION = "2026.08";

/** Historial de aceptaciones del perfil autenticado (más recientes primero). */
export async function getAcceptances() {
  return apiGet("/api/v1/auth/terms/acceptances");
}

/** Estado de cobertura de la versión vigente: aceptación propia o autorización del acudiente. */
export async function getTermsStatus() {
  return apiGet("/api/v1/auth/terms/status");
}

/**
 * Registra la aceptación de una versión de los Términos.
 * @param {string} termsVersion - Versión aceptada.
 * @param {string[]} studentProfileIds - ProfileIds de menores cubiertos (vacío = datos propios).
 */
export async function acceptTerms(termsVersion, studentProfileIds = []) {
  return apiPost("/api/v1/auth/terms/accept", {
    termsVersion,
    studentProfileIds,
    channel: "mobile",
  });
}

/**
 * Calcula qué aceptaciones faltan para la versión vigente:
 * la propia y, si es acudiente, la de cada hijo vinculado.
 */
export async function getPendingAcceptance() {
  const session = await getSession();
  if (!session?.profileId) {
    return { termsVersion: CURRENT_TERMS_VERSION, ownMissing: false, minors: [] };
  }

  // Si falla la consulta se propaga: un error de red no equivale a "no aceptó".
  const acceptances = await getAcceptances();
  const current = (acceptances ?? []).filter(
    (a) => a.termsVersion === CURRENT_TERMS_VERSION
  );
  const ownMissing = !current.some((a) => a.studentProfileId == null);

  let minors = [];
  if (session.roleId === PARENT_ROLE_ID) {
    const covered = new Set(
      current.filter((a) => a.studentProfileId != null).map((a) => a.studentProfileId)
    );
    const linked = await getLinkedStudents(session);
    minors = linked.filter((m) => !covered.has(m.profileId));
  }

  return { termsVersion: CURRENT_TERMS_VERSION, ownMissing, minors };
}

/** Roles que aceptan los Términos en el modal del login: conductor y acudiente. */
export const TERMS_MODAL_ROLE_IDS = [3, PARENT_ROLE_ID];

export function requiresTermsModal(roleId) {
  return TERMS_MODAL_ROLE_IDS.includes(roleId);
}

export function hasPendingAcceptance(pending) {
  return Boolean(pending?.ownMissing || pending?.minors?.length > 0);
}

/** Registra lo que falte de la versión vigente: primero los menores y luego la propia. */
export async function acceptPending(pending) {
  if (pending.minors.length > 0) {
    await acceptTerms(
      pending.termsVersion,
      pending.minors.map((m) => m.profileId),
    );
  }
  if (pending.ownMissing) {
    await acceptTerms(pending.termsVersion, []);
  }
}
