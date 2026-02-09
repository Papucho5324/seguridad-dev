"use server";
import { signIn } from "@/auth";
import { headers } from "next/headers"; // Importante para obtener la IP
import { createLog, isUserLocked } from "@/lib/logger";
import { AuthError } from "next-auth";

export async function loginUser(prevState: { error?: string } | undefined, formData: FormData) {
  const data = Object.fromEntries(formData);
  const headerList = await headers();
  const username = data.username as string; // Extraemos el intento de usuario
  const locked = await isUserLocked(username);
  const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";


  
if (locked) {
  return { error: "Demasiados intentos. Acceso bloqueado por 60 segundos." };
}

  try {
    await signIn("credentials", {
      ...data,
      redirectTo: "/dashboard"
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // 1. Registro de Intento Fallido
      // Usamos "SYSTEM" o "ANONYMOUS" si no hay ID, pero guardamos el 'username' intentado en detalles
      await createLog("SYSTEM", "LOGIN_FAILED", "User", {
        attemptedUsername: username,
        reason: "Invalid credentials",
        ip: ip 
      });

      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Usuario o contraseña incorrectos." };
        default:
          return { error: "Error de autenticación. Intente más tarde." };
      }
    }
    // IMPORTANTE: No pongas logs después de 'throw error' porque el redireccionamiento 
    // de Next.js también se lanza como un error técnico.
    throw error; 
  }
}