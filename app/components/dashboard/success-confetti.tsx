"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export function SuccessConfetti() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const verified = searchParams.get("verified");

  useEffect(() => {
    // 1. Escuchar la "señal de radio" de otras pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "email-verified-signal") {
        router.refresh(); // Forzar actualización de Server Components
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // 2. Lógica si esta es la pestaña que se acaba de verificar
    if (verified === "true") {
      // Mandar la señal a las demás pestañas
      localStorage.setItem("email-verified-signal", Date.now().toString());

      const shoot = () => {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FFE400", "#FFBD00", "#E89400"],
          shapes: ["star"]
        });
      };

      shoot();
      setTimeout(shoot, 200);

      // Limpieza de URL
      const timeout = setTimeout(() => {
        window.history.replaceState(null, "", "/dashboard");
      }, 1000);

      return () => {
        clearTimeout(timeout);
        window.removeEventListener("storage", handleStorageChange);
      };
    }

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [verified, router]);

  return null;
}