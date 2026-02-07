"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginUser(prevState: { error?: string } | undefined, formData: FormData) {
  try {
    await signIn("credentials", Object.fromEntries(formData));
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas." };
        default:
          return { error: "Algo salió mal en el servidor." };
      }
    }
    throw error; // Necesario para que Next.js maneje la redirección
  }
}