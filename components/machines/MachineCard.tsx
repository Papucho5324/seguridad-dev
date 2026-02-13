"use client";
import { Factory, CheckCircle2, AlertCircle, Trash2, Ban } from "lucide-react";
import { updateMachineStatus, deleteMachine } from "@/app/actions/machines";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";


interface Machine {
    id: number;
    name: string;
    description: string | null;
    status: string;
}

export function MachineCard({ machine }: { machine: Machine }) {
    return (
        <div className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Factory size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold">{machine.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                            {machine.description || "Sin descripción"}
                        </p>
                    </div>
                </div>
                {machine.status === "ACTIVE" && (
                    <CheckCircle2 className="text-emerald-500 size-5" />
                )}

                {machine.status === "MAINTENANCE" && (
                    <AlertCircle className="text-amber-500 size-5" />
                )}

                {machine.status === "INACTIVE" && (
                    <Ban className="text-red-500 size-5" />
                )}

            </div>

            {/* CONTROLES DE EDICIÓN Y BORRADO */}
            <div className="flex gap-2 mt-6 pt-4 border-t">
                <Select
                    defaultValue={machine.status}
                    onValueChange={(value) =>
                        updateMachineStatus(machine.id, value)
                    }
                >
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="ACTIVE">🟢 Activa</SelectItem>
                        <SelectItem value="MAINTENANCE">🟡 Mantenimiento</SelectItem>
                        <SelectItem value="INACTIVE">🔴 Inactiva</SelectItem>
                    </SelectContent>
                </Select>


                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="ml-auto text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                ¿Eliminar máquina?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Estás a punto de eliminar <b>{machine.name}</b>.
                                Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => deleteMachine(machine.id)}
                            >
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>

            <div className="mt-4 flex justify-between items-center text-[9px] text-muted-foreground uppercase tracking-widest opacity-70">
                <span>Status: {machine.status}</span>
                <span>ID: {machine.id}</span>
            </div>
        </div>
    );
}