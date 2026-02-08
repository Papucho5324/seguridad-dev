"use server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { auth } from "@/auth";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function resendVerificationEmail() {
  const session = await auth();
  
  // 1. Validación de sesión y pertenencia
  if (!session?.user?.id || !session?.user?.email) {
    return { error: "No autorizado o sesión no encontrada." };
  }

  // 2. Generar token criptográfico único
  const newToken = crypto.randomBytes(32).toString("hex");

  try {
    // 3. Actualizar la base de datos PRIMERO
    // Esto asegura la integridad: no enviamos el correo si el token no se guardó.
    await prisma.user.update({
      where: { id: session.user.id },
      data: { verificationToken: newToken },
    });

    const verificationLink = `http://localhost:3000/api/verify?token=${newToken}`;

    // 4. Enviar el correo usando Resend
    const { error } = await resend.emails.send({
      from: 'Seguridad Dev <onboarding@resend.dev>', // Resend permite este remitente en modo prueba
      to: session.user.email,
      subject: 'Verifica tu cuenta - Proyecto Seguridad',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333;">Hola, ${session.user.name || "Usuario"}</h2>
          <p>Has solicitado verificar tu correo para tu cuenta de estudiante (ID: 23110805).</p>
          <p>Haz clic en el botón de abajo para activar tu cuenta de forma segura:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #000; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Verificar mi cuenta
            </a>
          </div>
          <p style="font-size: 12px; color: #888;">Si no solicitaste este correo, puedes ignorarlo con seguridad.</p>
        </div>
      `
    });

    if (error) {
      console.error("Error de Resend:", error);
      return { error: "Error al enviar el correo electrónico." };
    }
    
    return { success: "Enlace enviado con éxito. Revisa tu bandeja de entrada." };

  } catch (error) {
    console.error("Error en la base de datos:", error);
    return { error: "Hubo un problema al procesar tu solicitud." };
  }
}