// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./lib/auth-config";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/zod";
import { verifyPassword } from "@/lib/auth-utils";

interface SessionUser {
  id: string;
  role: string;
  email?: string;
  name?: string;
  image?: string;
}

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
}

declare module "next-auth" {
  interface JWT {
    id: string;
    role: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        const { username, password } = validatedFields.data;
        const user = await prisma.user.findUnique({ where: { username } });

        // IMPORTANTE: Asegúrate de que el campo sea password o passwordHash 
        // según lo que tengas en tu schema.prisma actual
        if (!user || !user.passwordHash) return null;

        const passwordMatch = await verifyPassword(password, user.passwordHash);

        if (passwordMatch) {
          // Retornamos el objeto usuario completo, incluyendo el role
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role, // <--- El role sale de la DB aquí
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Cuando el usuario inicia sesión (user existe), guardamos el role en el JWT
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role; // <--- Guardamos el role en el token
      }
      return token;
    },
    async session({ session, token }) {
      // Pasamos el role del token a la sesión accesible por los componentes
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as SessionUser).role = token.role as string; // <--- El role ya está disponible en session.user.role
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});