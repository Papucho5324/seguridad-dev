import argon2 from "argon2";

// Convierte texto plano en un Hash seguro
export async function hashPassword(password: string) {
  return await argon2.hash(password);
}

// Compara una contraseña ingresada con el Hash de la DB
export async function verifyPassword(password: string, hash: string) {
  return await argon2.verify(hash, password);
}