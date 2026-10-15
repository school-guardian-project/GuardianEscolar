import { getUserApi } from "./userApi";

/** Rol de acudiente/padre en el JWT (catálogo Iam.Role). */
export const PARENT_ROLE_ID = 4;

/**
 * IDs con los que el backend identifica al usuario en una familia. El vínculo
 * puede venir por `profileId` o por `personId`, así que se comparan ambos.
 */
function identityIds(session) {
  return [session?.personId, session?.profileId].filter(Boolean);
}

/**
 * Estudiantes vinculados al acudiente autenticado, resueltos desde las
 * familias de ms-user-management (FR-1.4).
 *
 * Devuelve `[]` cuando el usuario no es acudiente, no tiene familia registrada
 * o el backend no responde: el llamador decide qué mostrar.
 *
 * @param {{personId?: string, profileId?: string, roleId?: number}} session
 * @returns {Promise<Array<{profileId: string, name: string}>>}
 */
export async function getLinkedStudents(session) {
  const myIds = identityIds(session);
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
