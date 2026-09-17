const crypto = require('crypto');
const fs = require('fs');

const path = '/home/juan/Documentos/projects/school-guardian/json-server/db.json';
const db = JSON.parse(fs.readFileSync(path, 'utf8'));

function makeHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(password + salt).digest('hex');
  return `$mock$v1$${salt}$${hash}`;
}

const rolePasswords = {
  1: 'Admin123!',
  2: 'Student123!',
  3: 'Parent123!',
  4: 'Driver123!',
};

let updated = 0;
for (const p of db.profiles) {
  const pw = rolePasswords[p.RoleId];
  if (pw) {
    p.PasswordHash = makeHash(pw);
    updated++;
  }
}

fs.writeFileSync(path, JSON.stringify(db, null, 2));
console.log(`Actualizados ${updated} perfiles`);
