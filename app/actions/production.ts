"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createLog } from "@/lib/logger";

export async function registerProduction(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session || !session.user) return { error: "Sesión no válida" };

  const machineId = parseInt(formData.get("machineId") as string);
  const pieces = parseInt(formData.get("pieces") as string);

  const startOfHour = new Date();
  startOfHour.setMinutes(0, 0, 0);
  const endOfHour = new Date();
  endOfHour.setMinutes(59, 59, 999);

  try {
    const existingRecord = await prisma.productionRecord.findFirst({
      where: {
        machineId,
        createdAt: { gte: startOfHour, lte: endOfHour }
      }
    });

    if (existingRecord) {
      return { error: "Ya se registró producción para esta máquina en la hora actual." };
    }

    await prisma.productionRecord.create({
      data: {
        machineId,
        piecesProduced: pieces,
        hourSlot: new Date(),
        userId: session.user.id,
      }
    });

    // 🔥 ESTA ES LA LÍNEA QUE TE FALTABA
    revalidatePath("/production");

    return {
      success: "Producción guardada. Máquina bloqueada hasta la siguiente hora."
    };
  } catch (error) {
    return { error: "Error de conexión." };
  }
}
