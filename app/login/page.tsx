"use client";
import { useState, useEffect } from "react";
import { useActionState } from "react";
import { loginUser } from "@/app/actions/login";
import RetroGrid from "../components/magicui/retro-grid";
import { motion } from "framer-motion";
import ConfettiOnSuccess from "../components/magicui/ConfettiOnSuccess";
import { LoginButton } from "../components/magicui/LoginButton";
import { BorderBeam } from "@/components/ui/border-beam";


export default function LoginPage() {
  // 1. Estado de la Server Action
  const [state, formAction] = useActionState(loginUser, { error: "" });
  
  // 2. Estado local para controlar la visibilidad del error y poder limpiarlo
  const [displayError, setDisplayError] = useState("");

  // 3. Sincronizar el error del servidor con el estado local
  useEffect(() => {
    if (state?.error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayError(state.error);
    }
  }, [state]);

  // 4. Determinar si el estado actual es de bloqueo
  const isLocked = displayError.includes("Demasiados intentos");

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <RetroGrid />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md px-8"
      >
        <ConfettiOnSuccess />
        <div className="rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-xl shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground">
              Iniciar Sesión
            </h1>
          </div>

          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Usuario</label>
              <input 
                name="username" 
                type="text" 
                required 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="Tu usuario"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contraseña</label>
              <input 
                name="password" 
                type="password" 
                required 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>

            {/* 5. Usamos displayError en lugar de state.error para permitir la limpieza */}
            {displayError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md text-center font-medium animate-in fade-in zoom-in duration-300">
                {displayError}
              </div>
            )}

            {/* 6. Pasamos la función setDisplayError para limpiar el mensaje al terminar el conteo */}
            <LoginButton 
              initiallyLocked={isLocked} 
              clearError={() => setDisplayError("")}
            />
          </form>
          
          <p className="mt-4 text-center text-xs text-muted-foreground">
            ¿No tienes cuenta? <a href="/register" className="text-primary hover:underline">Regístrate aquí</a>
          </p>
        </div>

      </motion.div>
    </main>
  );
}