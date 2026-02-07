import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // Si el usuario está en el dashboard y no está logueado, redirigir
  if (nextUrl.pathname.startsWith("/dashboard") && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  // Protege todas las rutas excepto las públicas (estáticos, api, login, register)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register|$).*)"],
};