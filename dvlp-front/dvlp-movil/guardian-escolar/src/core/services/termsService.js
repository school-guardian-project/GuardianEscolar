import { apiGet, apiPost } from "./apiClient";
import { getSession } from "./authService";
import { getUserApi } from "./userApi";

/** Versión vigente de los Términos. Debe coincidir con el documento legal publicado. */
export const CURRENT_TERMS_VERSION = "2026.08";

/** Rol de acudiente/padre en el JWT. */
const PARENT_ROLE_ID = 4;

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
  });
}

async function resolveMinors(session) {
  const myIds = [session?.personId, session?.profileId].filter(Boolean);
  if (myIds.length === 0 || session?.roleId !== PARENT_ROLE_ID) {
    return [];
  }

  try {
    const list = await getUserApi("/families");
    for (const item of list ?? []) {
      const detail = await getUserApi(`/families/${item.id}`);
      const ids = [detail.parentProfileId, ...(detail.children ?? [])];
      if (!ids.some((id) => myIds.includes(id))) {
        continue;
      }
      const minors = [];
      for (const childId of detail.children ?? []) {
        try {
          const student = await getUserApi(`/students/${childId}`);
          if (student?.profileId) {
            const name = `${student.name ?? ""} ${student.lastName ?? ""}`.trim();
            minors.push({ profileId: student.profileId, name: name || childId });
          }
        } catch {
          // Estudiante no resoluble: se omite, no bloquea al resto.
        }
      }
      return minors;
    }
  } catch {
    // Backend no disponible o el usuario aún no tiene familia.
  }
  return [];
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

  let acceptances = [];
  try {
    acceptances = await getAcceptances();
  } catch {
    acceptances = [];
  }
  const current = (acceptances ?? []).filter(
    (a) => a.termsVersion === CURRENT_TERMS_VERSION
  );
  const ownMissing = !current.some((a) => a.studentProfileId == null);

  let minors = [];
  if (session.roleId === PARENT_ROLE_ID) {
    const covered = new Set(
      current.filter((a) => a.studentProfileId != null).map((a) => a.studentProfileId)
    );
    const linked = await resolveMinors(session);
    minors = linked.filter((m) => !covered.has(m.profileId));
  }

  return { termsVersion: CURRENT_TERMS_VERSION, ownMissing, minors };
}
