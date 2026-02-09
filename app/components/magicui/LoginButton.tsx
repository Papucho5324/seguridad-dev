"use client";
import { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Lock, Loader2 } from "lucide-react";

interface LoginButtonProps {
  initiallyLocked: boolean;
  clearError: () => void; // Nueva prop para limpiar el mensaje rojo
}

export function LoginButton({ initiallyLocked, clearError }: LoginButtonProps) {
  const { pending } = useFormStatus();
  const [countdown, setCountdown] = useState(0);

  // Iniciar cuenta regresiva si el servidor detecta bloqueo
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initiallyLocked) setCountdown(60);
  }, [initiallyLocked]);

  // Manejador del reloj
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        const nextValue = countdown - 1;
        setCountdown(nextValue);
        
        // CUANDO LLEGA A CERO: Limpiamos el error visual
        if (nextValue === 0) {
          clearError();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, clearError]);

  const isBlocked = countdown > 0 || pending;

  return (
    <ShimmerButton
      disabled={isBlocked}
      className="w-full shadow-2xl transition-all disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="animate-spin size-4" />
      ) : countdown > 0 ? (
        <span className="flex items-center gap-2">
          <Lock className="size-4" /> Bloqueado ({countdown}s)
        </span>
      ) : (
        "Iniciar Sesión"
      )}
    </ShimmerButton>
  );
}