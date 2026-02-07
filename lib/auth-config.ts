import type { NextAuthConfig } from "next-auth";

// Esta configuración es "Edge-compatible", lo que significa que no 
// tiene dependencias de Node.js pesadas como Argon2 o Prisma.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirige al login si no está logueado
      }
      return true;
    },
  },
  providers: [], // Los proveedores se añaden en el archivo auth.ts principal
} satisfies NextAuthConfig;