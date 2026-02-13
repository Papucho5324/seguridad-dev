"use client";
import { useActionState, useState } from "react";
import { createMachine } from "@/app/actions/machines"; // Importamos tu Action
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AddMachineForm() {
  const [isOpen, setIsOpen] = useState(false);
  // Usamos el hook vinculando tu función createMachine
  const [state, formAction, isPending] = useActionState(createMachine, { error: "", success: "" });

  return (
    <div>
      <ShimmerButton onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Plus size={16} /> Añadir Máquina
      </ShimmerButton>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 bg-card border rounded-2xl shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Configurar Nueva Máquina</h2>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Identificador (Nombre)</label>
                  <input 
                    name="name" 
                    required 
                    placeholder="Ej: MVS2 o SP01"
                    className="w-full p-2 bg-background border rounded-md outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción técnica</label>
                  <textarea 
                    name="description" 
                    placeholder="Ubicación o función de la máquina"
                    className="w-full p-2 bg-background border rounded-md outline-none focus:ring-2 focus:ring-primary/50 h-24 resize-none"
                  />
                </div>

                {state?.error && <p className="text-xs text-destructive font-medium">{state.error}</p>}
                {state?.success && <p className="text-xs text-primary font-medium">{state.success}</p>}

                <div className="pt-2">
                  <ShimmerButton disabled={isPending} className="w-full">
                    {isPending ? "Procesando..." : "Guardar en Inventario"}
                  </ShimmerButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}