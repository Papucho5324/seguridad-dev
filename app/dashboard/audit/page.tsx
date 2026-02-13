import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ShieldCheck, User, Clock, Info } from "lucide-react";
import ExportCSVButton from "./ExportCSVButton";

interface SessionUser {
  role?: string;
}

export default async function AuditPage() {
  const session = await auth();

  // Validación de Seguridad
  if ((session?.user as SessionUser)?.role !== "ADMIN") {
    redirect("/dashboard?error=unauthorized");
  }

  // Obtenemos los últimos 50 logs con la información del usuario vinculada
  const logs = await prisma.auditLog.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
<div className="space-y-6">
      {/* Contenedor Flex para alinear Título + Botón */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-primary" /> Historial de Auditoría
          </h1>
          <p className="text-muted-foreground">
            Monitoreo de acciones críticas y eventos de seguridad.
          </p>
        </div>
        
        {/* El botón ahora vive dentro del flexbox del encabezado */}
        <ExportCSVButton filters={{}} />
      </div>


      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="p-4">Evento</th>
              <th className="p-4">Usuario</th>
              <th className="p-4">Entidad</th>
              <th className="p-4">Detalles Técnicos</th>
              <th className="p-4 text-right">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-semibold text-primary">{log.action}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-muted-foreground" />
                    {log.user?.username || "Sistema"}
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-secondary rounded-md text-[10px] uppercase font-bold">
                    {log.entity}
                  </span>
                </td>
                <td className="p-4">
                  <pre className="text-[10px] bg-background p-2 rounded border max-w-xs overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </td>
                <td className="p-4 text-right text-muted-foreground text-xs">
                  <div className="flex items-center justify-end gap-1">
                    <Clock size={12} />
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}