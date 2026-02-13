"use client";
import React from "react";
import { motion } from "framer-motion";

const GlassLayout = ({ children }) => {
  return (
    // Cambié el fondo a un blanco puro o slate-50 para que los colores resalten más
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white overflow-hidden font-sans">
      
      {/* --- CAPA DE ESFERAS AMBIENTALES --- */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* Esfera 1: Indigo/Violeta Suave (Top Derecha) */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          // Subimos la opacidad a 50-60 para que sea visible y usamos colores definidos
          className="absolute top-[-10%] right-[5%] w-80 h-80 rounded-full bg-gradient-to-br from-indigo-100 to-purple-200 blur-3xl opacity-60"
        />

        {/* Esfera 2: Cyan/Soft Blue (Bottom Izquierda) */}
        <motion.div
          animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[5%] left-[5%] w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-100 to-blue-200 blur-3xl opacity-50"
        />

        {/* Esfera 3: Acento Rosa Pastel (Centro Izquierda) */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[15%] w-64 h-64 rounded-full bg-gradient-to-b from-rose-100 to-teal-50 blur-2xl opacity-40"
        />
      </div>

      {/* --- CONTENIDO DINÁMICO --- */}
      <main className="relative z-10 w-full max-w-4xl px-6">
        {children}
      </main>
    </div>
  );
};

export default GlassLayout;