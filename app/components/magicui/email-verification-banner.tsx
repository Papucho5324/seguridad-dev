"use client";

import { resendVerificationEmail } from "@/app/actions/verify-email";
import { toast } from "sonner";
import { ChevronRight, MailWarning, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { useState, useRef } from "react";

interface Props {
  email: string;
}

const COOLDOWN_MS = 60_000;

export function EmailVerificationBanner({ email }: Props) {
  const [loading, setLoading] = useState(false);
  const lastSentRef = useRef<number | null>(null);

  const handleResend = async () => {
    // ⛔ Bloqueo por cooldown
    if (lastSentRef.current) {
      const elapsed = Date.now() - lastSentRef.current;
      const remaining = Math.ceil((COOLDOWN_MS - elapsed) / 1000);

      if (remaining > 0) {
        toast.warning("Espera un momento", {
          description: `Podrás reenviar el correo en ${remaining}s`,
          id: "email-cooldown",
        });
        return;
      }
    }

    if (loading) return;

    setLoading(true);

    try {
      const result = await resendVerificationEmail();

      if (result.success) {
        lastSentRef.current = Date.now(); // 👈 marca el tiempo

        toast.success("¡Correo enviado!", {
          description: `Revisa tu bandeja en ${email}`,
          duration: 5000,
        });
      } else {
        toast.error("Error", {
          description: result.error || "No se pudo enviar el token.",
        });
      }
    } catch {
      toast.error("Error de conexión", {
        description: "Inténtalo de nuevo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-10 flex items-center justify-center mb-8">
      <button
        onClick={handleResend}
        disabled={loading}
        className={cn(
          "group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 transition-all duration-500 ease-out",
          "bg-background/50 backdrop-blur-sm border border-white/10 shadow-[inset_0_-8px_10px_#8fdfff1f]",
          "hover:shadow-[inset_0_-5px_10px_#8fdfff3f] active:scale-[0.98] disabled:opacity-70",
          "cursor-pointer overflow-hidden"
        )}
      >
        <span
          className={cn(
            "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]",
            "pointer-events-none"
          )}
          style={{
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            mask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "subtract",
          }}
        />

        <div className="relative z-20 flex items-center">
          {loading ? (
            <Loader2 className="size-4 animate-spin text-orange-400 mr-1" />
          ) : (
            <MailWarning className="size-4 text-orange-400 mr-1" />
          )}

          <AnimatedGradientText className="text-sm font-medium">
            Verifica tu correo:
            <span className="text-muted-foreground ml-1">{email}</span>
          </AnimatedGradientText>

          <ChevronRight className="size-4 ml-1 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
      </button>
    </div>
  );
}
