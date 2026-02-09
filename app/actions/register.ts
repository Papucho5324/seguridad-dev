"use server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { registerSchema } from "@/lib/zod";
import { redirect } from "next/navigation";
import { createLog } from "@/lib/logger";

export async function registerUser(prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData);

  // 1. Validar primero con Zod
  const validatedFields = registerSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Datos inválidos. Revisa el formato y la fuerza de la contraseña." };
  }

  // 2. Extraer y Sanitizar (Limpiar)
  const { password } = validatedFields.data;
  const email = validatedFields.data.email.toLowerCase().trim();
  const username = validatedFields.data.username.trim();

  try {
    // 3. Cifrar
    const passwordHash = await hashPassword(password);

    // 4. Guardar
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });
    await createLog(newUser.id, "USER_REGISTERED", "User", { 
  username: newUser.username 
});
  } catch (error: unknown) {
    // Manejo seguro del error de duplicados (P2002 es el código de Prisma para Unique Constraint)
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2002') {
      return { error: "El usuario o email ya están registrados." };
    }
    return { error: "Error interno del servidor." };
  }

  redirect("/login?registered=success");
}