// [MOCK-API] Servicio móvil para cambiar email/teléfono/contraseña — Cliente -> :3000 -> DB
import { apiClient } from './api.client';
import { ENDPOINTS } from './api.config';

// Holder temporal para flujos multi-paso
let pendingEmail = null;
let pendingPhone = null;
export const pendingProfile = {
  setEmail(v) { pendingEmail = v; },
  getEmail() { return pendingEmail; },
  setPhone(v) { pendingPhone = v; },
  getPhone() { return pendingPhone; },
  clear() { pendingEmail = null; pendingPhone = null; },
};

async function currentPerson(emailHint) {
  // Intenta por email de sesión o hint
  const email = emailHint || pendingEmail || 'estudiante1@guardianescolar.demo';
  const persons = await apiClient.query(ENDPOINTS.persons, { Email: email });
  if (persons?.length) return persons[0];
  // fallback: primer admin
  const all = await apiClient.query(ENDPOINTS.persons, { Email: 'admin1@colegio.edu.co' });
  return all[0];
}

export const profileUpdateService = {
  async updateEmail(newEmail, emailHint) {
    const email = newEmail || pendingEmail;
    if (!email) throw new Error('Email requerido');
    const p = await currentPerson(emailHint);
    if (!p) throw new Error('Persona no encontrada');
    const merged = { ...p, Email: email, id: p.id ?? p.Id, Id: p.Id ?? p.id };
    const res = await apiClient.put(`/persons/${merged.id}`, merged);
    pendingEmail = null;
    return res;
  },
  async updatePhone(newPhone, emailHint) {
    const phone = newPhone || pendingPhone;
    if (!phone) throw new Error('Teléfono requerido');
    const clean = String(phone).replace(/\D/g, '');
    const p = await currentPerson(emailHint);
    if (!p) throw new Error('Persona no encontrada');
    const merged = { ...p, Phone: Number(clean) || clean, id: p.id ?? p.Id, Id: p.Id ?? p.id };
    const res = await apiClient.put(`/persons/${merged.id}`, merged);
    pendingPhone = null;
    return res;
  },
  async updatePassword(newPassword, emailHint) {
    if (!newPassword || newPassword.length < 6) throw new Error('Contraseña muy corta');
    const p = await currentPerson(emailHint);
    if (!p) throw new Error('Persona no encontrada');
    const profiles = await apiClient.query(ENDPOINTS.profiles, { PersonId: p.Id });
    const prof = profiles[0];
    if (!prof) throw new Error('Perfil no encontrado');
    const fakeHash = `AQAAAAEAACcQAAAAE${btoa(newPassword).slice(0, 20)}==`;
    const merged = { ...prof, PasswordHash: fakeHash, id: prof.id ?? prof.Id, Id: prof.Id ?? prof.id };
    const res = await apiClient.put(`/profiles/${merged.id}`, merged);
    return res;
  },
};
