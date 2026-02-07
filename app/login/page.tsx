/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { motion } from "framer-motion";
import RetroGrid from "../components/magicui/retro-grid";
import { cn } from "@/lib/utils"; // Tu utilidad que ya configuramos

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <RetroGrid />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-md px-8"
      >
        <div className="rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-xl shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground">
              Bienvenido
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Usuario</label>
              <input 
                type="text" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="luis.chavez"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Contraseña</label>
              <input 
                type="password" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <button className="relative w-full overflow-hidden rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium transition-all hover:brightness-110 active:scale-[0.98]">
              <span className="relative z-10">Iniciar Sesión</span>
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <hr className="w-full border-muted" />
            <span className="px-2">O</span>
            <hr className="w-full border-muted" />
          </div>

          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-sm font-medium hover:bg-accent transition-colors" onClick={() => window.location.href = '/register'}>
            Registrarse
          </button>
        </div>
      </motion.div>
    </main>
  );
}