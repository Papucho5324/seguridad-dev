"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";
import { RetroGrid } from "@/components/ui/retro-grid";



export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Aquí irían tus componentes de Magic UI como RetroGrid o Meteors */}
      <div className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
        Proyecto con Magic UI
      </div>
      <RetroGrid />
      <p className="mt-4 text-black">
        Next.js + Tailwind CSS + Framer Motion
      </p>
      
      <div className="mt-8 flex gap-4">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" onClick={() => window.location.href = '/login'}>
          Empezar
        </button>
      </div>
    </main>
  );
}