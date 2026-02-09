"use client";
import { useActionState } from "react";
import { loginUser } from "@/app/actions/login";
import RetroGrid from "../components/magicui/retro-grid";
import { motion } from "framer-motion";
import ConfettiOnSuccess from "../components/magicui/ConfettiOnSuccess";

import { cn } from "@/lib/utils";
import { isUserLocked } from "@/lib/logger";
import { LoginButton } from "../components/magicui/LoginButton";

export default function LoginPage() {
  // state contendrá el error si las credenciales fallan
  const [state, formAction, isPending] = useActionState(loginUser, { error: "" });
  const isLocked = state?.error?.includes("Demasiados intentos");

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

          {/* Conectamos la acción al formulario */}
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Usuario</label>
              <input 
                name="username" // Importante: debe coincidir con el loginSchema
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

            {/* Mostramos errores de autenticación de forma segura */}
            {state?.error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md text-center font-medium animate-in fade-in zoom-in duration-300">
                {state.error}
              </div>
            )}

            <LoginButton initiallyLocked={isLocked || false} />
          </form>
          
          <p className="mt-4 text-center text-xs text-muted-foreground">
            ¿No tienes cuenta? <a href="/register" className="text-primary hover:underline">Regístrate aquí</a>
          </p>
        </div>
      </motion.div>
    </main>
  );
}