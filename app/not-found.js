"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Error404 = () => {
  const router = useRouter();

  const bubbleVariants = {
    animate: {
      y: [0, -30, 0],
      x: [0, 20, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
      {/* Fondo: 404 - Lo bajé de opacidad para que no compita con el texto */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-[15rem] md:text-[25rem] font-bold text-slate-400/30 select-none">
          404
        </h1>
      </div>

      {/* --- ESFERAS MINIMALISTAS --- */}

      {/* Esfera 1: Violeta Suave (Top Derecha) */}
      <motion.div
        variants={bubbleVariants}
        animate="animate"
        className="absolute top-[-10%] right-[10%] w-96 h-96 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 blur-3xl opacity-60"
      />

      {/* Esfera 2: Rosa Pálido (Bottom Centro) */}
      <motion.div
        animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-5%] right-[20%] w-80 h-80 rounded-full bg-gradient-to-tr from-rose-300 to-orange-400 blur-3xl opacity-50"
      />

      {/* Esfera 3: Azul Glaciar (Centro Izquierda) */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/4 left-[-5%] w-72 h-72 rounded-full bg-gradient-to-b from-cyan-300 to-blue-400 blur-2xl opacity-40"
      />

      {/* Contenido */}
      <div className="relative z-10 text-left max-w-lg p-8">
        <h2 className="text-7xl font-bold text-slate-800 mb-4 tracking-tight">
          Ooops!
        </h2>
        <p className="text-xl text-slate-500 mb-8 leading-relaxed">
          Favor de regresar por donde vino, aquí no hay nada que ver...
        </p>

        <button
          onClick={() => router.back()}
          className="group inline-flex items-center gap-3 text-indigo-500 font-semibold text-lg transition-all hover:text-indigo-600"
        >
          Regresar
          <span className="transition-transform group-hover:translate-x-2">
            →
          </span>
        </button>
      </div>
    </div>
  );
};

export default Error404;
