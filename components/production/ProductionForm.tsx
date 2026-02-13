"use client";
import { useActionState, useState } from "react";
import { registerProduction } from "@/app/actions/production";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Settings2, Hash, CheckCircle, AlertCircle, Lock } from "lucide-react";

interface Machine {
  id: number;
  name: string;
}

interface ProductionState {
  error?: string;
  success?: string;
}

export function ProductionForm({ 
machines = [], // Valor por defecto vacío
  blockedMachineIds = [] // Valor por defecto para evitar el error 'undefined'
}: { 
  machines: Machine[], 
  blockedMachineIds: number[] 
}) {
  const [state, formAction, isPending] = useActionState(registerProduction, {} as ProductionState);
  const [selectedMachine, setSelectedMachine] = useState<string>("");

  // Añadimos una validación extra de seguridad
  const isCurrentMachineBlocked = blockedMachineIds?.includes(parseInt(selectedMachine)) ?? false;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isCurrentMachineBlocked) {
      e.preventDefault();
      return;
    }

    // Confirmación de Management: Bloqueo de personal a la máquina
    const confirmSet = confirm(
      "¿Seguro que quieres setear esta máquina? Al confirmar la producción, esta unidad quedará bloqueada para nuevos registros hasta la siguiente hora."
    );
    
    if (!confirmSet) {
      e.preventDefault();
    }
  };

  return (
    <div className="p-8 border rounded-2xl shadow-xl bg-card/50 backdrop-blur-sm border-border">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Settings2 size={18} className="text-primary" /> 
        Registro de Producción
      </h2>

      <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Máquina */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Máquina asignada</label>
          <select
            name="machineId"
            required
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value)}
            className="w-full p-3 bg-background border rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
          >
            <option value="">-- Seleccione una unidad --</option>
            {machines.map((machine) => (
              <option 
                key={machine.id} 
                value={machine.id}
                disabled={blockedMachineIds.includes(machine.id)}
              >
                {machine.name} {blockedMachineIds.includes(machine.id) ? "🔒 (Registrada esta hora)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Lógica de Interfaz Bloqueada vs Activa */}
        {isCurrentMachineBlocked ? (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 text-xs font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <Lock size={18} className="shrink-0 mt-0.5" />
            <p>
              Esta máquina ya cuenta con un registro de producción para la hora actual. 
              El acceso se restablecerá automáticamente al inicio de la siguiente hora.
            </p>
          </div>
        ) : (
          <>
            {/* Cantidad de Piezas */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Piezas Producidas (HxH)</label>
              <div className="relative">
                <Hash className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
                <input
                  name="pieces"
                  type="number"
                  min="1"
                  required
                  placeholder="0"
                  className="w-full p-3 pl-10 bg-background border rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <ShimmerButton disabled={isPending} className="w-full py-4 font-bold tracking-wide">
              {isPending ? "Registrando..." : "Confirmar Entrega"}
            </ShimmerButton>
          </>
        )}

        {/* Feedback de Estado */}
        {state?.error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs font-medium flex items-center gap-2">
            <AlertCircle size={14} /> {state.error}
          </div>
        )}

        {state?.success && (
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs font-medium flex items-center gap-2">
            <CheckCircle size={14} /> {state.success}
          </div>
        )}
      </form>
    </div>
  );
}