"use server";
import { prisma } from "@/lib/prisma";
import { createLog } from "@/lib/logger";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createMachine(
  _state: { error?: string; success?: string },
  formData: FormData
) {
  const session = await auth();
  
  // RS-05: Solo el ADMIN puede crear máquinas
  if ((session?.user as { role: string })?.role !== "ADMIN") {
    return { error: "No autorizado para gestionar infraestructura." };
  }

  if (!session || !session.user || !session.user.id) {
    return { error: "Sesión inválida." };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  try {
    const newMachine = await prisma.machine.create({
      data: { name, description }
    });

    // RS-07: Registro de auditoría para Management
    await createLog(session.user.id as string, "CREATE_MACHINE", "Machine", {
      machineName: name,
      machineId: newMachine.id
    });

    revalidatePath("/dashboard/admin/machines");
    return { success: `Máquina ${name} añadida correctamente.` };
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2002') return { error: "Ese nombre de máquina ya existe." };
    return { error: "Error interno al crear la máquina." };
  }
}


// ACTUALIZAR MÁQUINA
export async function updateMachineStatus(id: number, newStatus: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "No autorizado" };

  try {
    const machine = await prisma.machine.update({
      where: { id },
      data: { status: newStatus }
    });

    await createLog(session.user.id, "UPDATE_MACHINE_STATUS", "Machine", {
      machineId: id,
      newStatus: newStatus
    });

    revalidatePath("/dashboard/machines");
    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar" };
  }
}

// BORRADO LÓGICO (Recomendado para integridad de datos)
export async function deleteMachine(id: number) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "No autorizado" };

  try {
    // Verificamos si tiene producción registrada antes de borrar
    const hasProduction = await prisma.productionRecord.findFirst({ where: { machineId: id } });
    
    if (hasProduction) {
      // Si tiene datos, mejor la desactivamos para no romper el historial
      await prisma.machine.update({ where: { id }, data: { status: "INACTIVE" } });
      return { error: "No se puede borrar porque tiene historial. Se ha marcado como INACTIVA." };
    }

    await prisma.machine.delete({ where: { id } });
    await createLog(session.user.id, "DELETE_MACHINE", "Machine", { machineId: id });

    revalidatePath("/dashboard/machines");
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar" };
  }
}