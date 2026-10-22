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

function fullName(person) {
  return `${person?.name ?? ""} ${person?.lastName ?? ""}`.trim();
}

/**
 * Familia del usuario autenticado (acudiente o estudiante), o `null` si no
 * tiene una. Devuelve el detalle de ms-user-management: `parentProfileId` y
 * `children` (profileIds de los estudiantes).
 */
export async function findMyFamily(session) {
  const myIds = identityIds(session);
  if (myIds.length === 0) {
    return null;
  }

  // ponytail: recorre las familias hasta encontrar la del usuario;
  // pedir ?profileId= al backend cuando la lista crezca.
  const list = await getUserApi("/families");
  for (const item of list ?? []) {
    const detail = await getUserApi(`/families/${item.id}`);
    const ids = [detail?.parentProfileId, ...(detail?.children ?? [])];
    if (ids.some((id) => myIds.includes(id))) {
      return detail;
    }
  }
  return null;
}

/**
 * Nombre por profileId desde un listado de personas (`/students`, `/parents`).
 * `/students/{id}` busca por personId, no por profileId, así que el cruce se
 * hace contra el listado, que sí trae el profileId de cada persona.
 */
export async function namesByProfileId(listPath) {
  const names = new Map();
  try {
    for (const person of (await getUserApi(listPath)) ?? []) {
      if (person?.profileId) {
        names.set(person.profileId, fullName(person));
      }
    }
  } catch {
    // Sin nombres el llamador muestra lo que tenga; no bloquea el flujo.
  }
  return names;
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
  if (session?.roleId !== PARENT_ROLE_ID || identityIds(session).length === 0) {
    return [];
  }

  try {
    const family = await findMyFamily(session);
    const children = family?.children ?? [];
    if (children.length === 0) {
      return [];
    }

    const names = await namesByProfileId("/students");
    return children.map((profileId) => ({
      profileId,
      name: names.get(profileId) || profileId,
    }));
  } catch {
    // Backend no disponible o el usuario aún no tiene familia.
    return [];
  }
}
