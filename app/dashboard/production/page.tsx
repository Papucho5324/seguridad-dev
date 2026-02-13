import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ProductionForm } from "@/components/production/ProductionForm";
import { History, LayoutList } from "lucide-react";

export default async function ProductionPage() {
    const session = await auth();

    const startOfHour = new Date();
    startOfHour.setMinutes(0, 0, 0);

    // 1. Obtener IDs de máquinas ya registradas esta hora
    const recordedThisHour = await prisma.productionRecord.findMany({
        where: {
            createdAt: { gte: startOfHour }
        },
        select: { machineId: true }
    });
    
const blockedIds = recordedThisHour.map(r => r.machineId);
    // 2. Cargar máquinas activas
const activeMachines = await prisma.machine.findMany({
        where: { status: "ACTIVE" }
    });
    // Obtenemos los últimos registros del usuario actual de HOY para el resumen
    const todayRecords = await prisma.productionRecord.findMany({
        where: {
            userId: session?.user?.id,
            createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)), 
            }
        },
        include: { machine: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-10">
            {/* CABECERA Y FORMULARIO */}
            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">Registro HxH</h1>
                        <p className="text-muted-foreground">Captura de resultados de producción por hora.</p>
                    </div>
                    {/* Formulario de Registro */}
                    <ProductionForm machines={activeMachines} blockedMachineIds={blockedIds} />
                </div>

                {/* VISTA RÁPIDA DE ÚLTIMOS 5 REGISTROS */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <History size={20} className="text-primary" /> Recientes
                    </h2>
                    <div className="space-y-3">
                        {todayRecords.slice(0, 5).map((log) => (
                            <div key={log.id} className="p-4 border rounded-xl bg-card flex justify-between items-center shadow-sm">
                                <div>
                                    <p className="font-bold text-sm">{log.machine.name}</p>
                                    <p className="text-[10px] text-muted-foreground italic">
                                        {new Date(log.hourSlot).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-primary">{log.piecesProduced}</span>
                                    <p className="text-[9px] uppercase tracking-tighter">Piezas</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECCIÓN DE HISTORIAL DEL TURNO (RS-03: Trazabilidad) */}
            <div className="pt-8 border-t">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <LayoutList className="text-primary" size={20} /> Resumen de tu Turno
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {todayRecords.map((record) => (
                        <div key={record.id} className="flex justify-between items-center p-4 border rounded-xl bg-card/50">
                            <div>
                                <span className="text-[10px] font-bold text-primary uppercase px-2 py-0.5 bg-primary/10 rounded-full">
                                    {record.machine.name}
                                </span>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Slot: {new Date(record.hourSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <div className="text-xl font-black">
                                {record.piecesProduced} <span className="text-[10px] font-normal text-muted-foreground">pcs</span>
                            </div>
                        </div>
                    ))}
                    {todayRecords.length === 0 && (
                        <p className="col-span-full text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl">
                            Aún no has registrado producción en este turno.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}