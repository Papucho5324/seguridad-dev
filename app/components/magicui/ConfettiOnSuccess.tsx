"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function ConfettiOnSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const fireConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 999,
    };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: 0 },
      });

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: 0 },
      });
    }, 250);
  };

  useEffect(() => {
    const success = searchParams.get("registered");

    if (success === "success") {
      fireConfetti();

      // Limpia el parámetro para que no se repita
      router.replace("/login");
    }
  }, [searchParams, router]);

  return null; // 👈 no renderiza nada
}
