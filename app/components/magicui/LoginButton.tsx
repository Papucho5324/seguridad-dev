"use client";
import { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Lock, Loader2 } from "lucide-react";

export function LoginButton({ initiallyLocked }: { initiallyLocked: boolean }) {
  const { pending } = useFormStatus();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initiallyLocked) setCountdown(60);
  }, [initiallyLocked]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const isBlocked = countdown > 0 || pending;

  return (
    <div className="w-full space-y-2">
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
    </div>
  );
}