import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) redirect("/dashboard?error=missing_token");

  let success = false;

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      // Usamos return para evitar que el catch atrape el redirect si lo pusiéramos aquí
      success = false;
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          emailVerified: new Date(),
          verificationToken: null 
        },
      });
      success = true;
    }
  } catch (error) {
    console.error("Error en la base de datos:", error);
    redirect("/dashboard?error=server_error");
  }

  // Llamamos a redirect fuera del bloque try-catch
  if (success) {
    redirect("/dashboard?verified=true");
  } else {
    redirect("/dashboard?error=invalid_token");
  }
}