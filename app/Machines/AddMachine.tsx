"use server";
import { prisma } from "@/lib/prisma";
import { createLog } from "@/lib/logger";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createMachine(formData: FormData) {
  const session = await auth();
  
  // RS-05: Solo el ADMIN puede crear máquinas
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return { error: "No autorizado para gestionar infraestructura." };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  try {
    const newMachine = await prisma.machine.create({
      data: { name, description }
    });

    // RS-07: Registro de auditoría para Management
    if (session?.user?.id) {
      await createLog(session.user.id as string, "CREATE_MACHINE", "Machine", {
        machineName: name,
        machineId: newMachine.id
      });
    }

    revalidatePath("/dashboard/admin/machines");
    return { success: `Máquina ${name} añadida correctamente.` };
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') return { error: "Ese nombre de máquina ya existe." };
    return { error: "Error interno al crear la máquina." };
  }
}