"use server";
import { prisma } from "@/lib/prisma"; 
import { hashPassword } from "@/lib/auth-utils";
import { registerSchema } from "@/lib/zod";

export async function signUp(formData: FormData) {
  // 1. Extraer y Validar con Zod
  const data = Object.fromEntries(formData);
  const validatedFields = registerSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Datos inválidos" };
  }

  const { username, email, password } = validatedFields.data;

  // 2. Cifrar la contraseña
  const passwordHash = await hashPassword(password);

  // 3. Guardar en Supabase vía Prisma
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });
    return { success: true, userId: user.id };
  } catch (e) {
    return { error: "El usuario o email ya existe" };
  }
}