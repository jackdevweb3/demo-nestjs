import { createCipheriv, createDecipheriv } from 'crypto';
const encryption_key = 'VFNtbRQM0yBOFd29'; // Must be 16 characters
const initialization_vector = '3fERF2D4f4mgi2N8'; // Must be 16 characters

export function encrypt(text) {
  const cipher = createCipheriv(
    'aes-128-cbc',
    Buffer.from(encryption_key),
    Buffer.from(initialization_vector),
  );
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

export function decrypt(text) {
  const decipher = createDecipheriv(
    'aes-128-cbc',
    Buffer.from(encryption_key),
    Buffer.from(initialization_vector),
  );
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}
