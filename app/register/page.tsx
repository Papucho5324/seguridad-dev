"use client";
import { useActionState, useState } from "react"; // Añadido useState
import { registerUser } from "@/app/actions/register";
import RetroGrid from "../components/magicui/retro-grid";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, null);
  const [password, setPassword] = useState(""); // Estado para el medidor

  const checkStrength = (pass: string) => {
    if (pass.length === 0) return { label: "", color: "bg-gray-200", width: "0%" };
    if (pass.length < 8) return { label: "Muy débil", color: "bg-red-500", width: "25%" };
    
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pass);

    if (hasUpper && hasNumber && hasSpecial && pass.length >= 10) 
      return { label: "Fuerte", color: "bg-green-500", width: "100%" };
    
    return { label: "Media", color: "bg-yellow-500", width: "60%" };
  };

  const strength = checkStrength(password);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <RetroGrid />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 w-full max-w-md px-8"
      >
        <div className="rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-6">Crear Cuenta</h2>
          
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre de Usuario</label>
              <input name="username" type="text" required className="w-full p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Correo Electrónico</label>
              <input name="email" type="email" required className="w-full p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contraseña</label>
              <input 
                name="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Captura de tiempo real
                className="w-full p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50" 
              />
              
              {/* Medidor de Fuerza Visual */}
              <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${strength.color}`} 
                  style={{ width: strength.width }}
                ></div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{strength.label}</p>
            </div>

            {state?.error && (
              <p className="text-destructive text-sm font-medium text-center bg-destructive/10 py-2 rounded-md border border-destructive/20">
                {state.error}
              </p>
            )}

            <button 
              disabled={isPending}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:brightness-110 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {isPending ? "Validando Seguridad..." : "Registrarse"}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}