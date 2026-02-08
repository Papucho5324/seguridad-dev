import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./lib/auth-config";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/zod";
import { verifyPassword } from "@/lib/auth-utils";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const { username, password } = validatedFields.data;
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user || !user.passwordHash) return null;

        const passwordMatch = await verifyPassword(password, user.passwordHash);

        if (passwordMatch) return user;
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Si el usuario acaba de iniciar sesión, añadimos su id al token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Pasamos el id del token a la sesión de la aplicación
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirige aquí si se requiere auth
  },
  session: { strategy: "jwt" }, // Sesiones seguras vía Tokens
});