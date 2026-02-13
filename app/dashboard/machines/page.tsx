import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AddMachineForm } from "@/components/machines/AddMachineForm";
import { MachineCard } from "@/components/machines/MachineCard";

export default async function MachinesPage() {
  const session = await auth();
  
  if ((session?.user as { role: string })?.role !== "ADMIN") {
    redirect("/dashboard?error=unauthorized");
  }

  const machines = await prisma.machine.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Maquinaria</h1>
          <p className="text-muted-foreground">Administración de activos y estatus de planta.</p>
        </div>
        <AddMachineForm />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}

        {machines.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl text-muted-foreground">
            No hay máquinas configuradas.
          </div>
        )}
      </div>
    </div>
  );
}