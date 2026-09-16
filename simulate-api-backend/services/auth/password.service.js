// [SIMULATE-API-BACKEND] Servicio centralizado de hashing de contraseñas
// Formato: $mock$v1$<salt>$<hash>
// Simula bcrypt pero es consistente y predecible para mock

const SALT_LENGTH = 16;
const HASH_PREFIX = '$mock$v1$';

// Genera un salt aleatorio
function generateSalt() {
  const array = new Uint8Array(SALT_LENGTH);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < SALT_LENGTH; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// Hash simple pero consistente (simula PBKDF2/bcrypt)
async function hashPassword(password, salt) {
  // Usar SHA-256 simple para mock (en producción sería bcrypt/argon2)
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Fallback para entornos sin crypto.subtle
    let hash = 0;
    const str = password + salt;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
}

/**
 * Hashea una contraseña con formato estandarizado
 * @param {string} password - Contraseña en texto plano
 * @returns {string} Hash en formato $mock$v1$<salt>$<hash>
 */
export async function hashPasswordAsync(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Contraseña requerida');
  }
  const salt = generateSalt();
  const hash = await hashPassword(password, salt);
  return `${HASH_PREFIX}${salt}$${hash}`;
}

/**
 * Verifica una contraseña contra un hash
 * @param {string} password - Contraseña en texto plano
 * @param {string} storedHash - Hash almacenado
 * @returns {boolean} true si coincide
 */
export async function verifyPasswordAsync(password, storedHash) {
  if (!password || !storedHash) return false;
  
  // Formato legacy: mock-<password>
  if (storedHash.startsWith('mock-')) {
    return storedHash === `mock-${password}`;
  }
  
  // Formato nuevo: $mock$v1$<salt>$<hash>
  if (storedHash.startsWith(HASH_PREFIX)) {
    const parts = storedHash.slice(HASH_PREFIX.length).split('$');
    if (parts.length !== 2) return false;
    
    const [salt, expectedHash] = parts;
    const hash = await hashPassword(password, salt);
    return hash === expectedHash;
  }
  
  // Formato legacy: AQAAAA (base64)
  if (storedHash.startsWith('AQAAAAEAACcQAAAAE')) {
    try {
      const b64 = typeof btoa === 'function' ? btoa(password) : require('base-64').encode(password);
      const expected = `AQAAAAEAACcQAAAAE${b64.slice(0, 20)}==`;
      return storedHash === expected;
    } catch {
      return false;
    }
  }
  
  // Formato legacy: $2b$10$demo (acepta cualquier cosa)
  if (storedHash.startsWith('$2b$10$demo')) {
    return true;
  }
  
  return false;
}

/**
 * Versión síncrona para compatibilidad (usa mock simple)
 * @param {string} password - Contraseña en texto plano
 * @returns {string} Hash en formato mock-<password>
 */
export function hashPasswordSync(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Contraseña requerida');
  }
  return `mock-${password}`;
}

/**
 * Versión síncrona de verificación
 * @param {string} password - Contraseña en texto plano
 * @param {string} storedHash - Hash almacenado
 * @returns {boolean} true si coincide
 */
export function verifyPasswordSync(password, storedHash) {
  if (!password || !storedHash) return false;
  
  // Formato mock-<password>
  if (storedHash.startsWith('mock-')) {
    return storedHash === `mock-${password}`;
  }
  
  // Para otros formatos, usar versión async
  // En mock, aceptar cualquier cosa para compatibilidad
  return true;
}

export default {
  hashPasswordAsync,
  verifyPasswordAsync,
  hashPasswordSync,
  verifyPasswordSync,
};
