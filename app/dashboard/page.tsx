import { auth, signOut } from "@/auth";
import RetroGrid from "../components/magicui/retro-grid";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  // Redirección de seguridad en el servidor
  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-6">
      <RetroGrid />
      {!user?.emailVerified && (
      <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-2 text-center text-sm text-yellow-600 dark:text-yellow-400 backdrop-blur-md">
        ⚠️ Tu correo no ha sido verificado. 
        <button className="ml-2 underline font-bold hover:text-yellow-500">
          Reenviar enlace de activación
        </button>
      </div>
    )}
    {/* Resto de tu Dashboard */}
      
      <div className="z-10 w-full max-w-5xl space-y-8">
        <header className="flex justify-between items-center bg-card/50 p-6 rounded-2xl border border-border backdrop-blur-md shadow-glow">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">Panel de Control</h1>
            <p className="text-muted-foreground text-sm">Bienvenido, {session.user?.name}</p>
          </div>
          
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <button className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg hover:bg-destructive hover:text-white transition-all">
              Cerrar Sesión
            </button>
          </form>
        </header>

        {/* Bento Grid de Información */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-card/50 p-8 rounded-2xl border border-border backdrop-blur-md shadow-sm">
            <h2 className="text-xl font-bold mb-4">Información del Estudiante</h2>
            <div className="space-y-2">
              <p className="text-sm"><strong>Nombre:</strong> Luis Alfonso Chavez Urbina</p>
              <p className="text-sm"><strong>ID Estudiante:</strong> 23110805</p>
              <p className="text-sm"><strong>Materia:</strong> Seguridad Dev Software</p>
            </div>
          </div>

          <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 backdrop-blur-md flex flex-col justify-center items-center text-center">
            <div className="text-4xl font-bold text-primary">Status</div>
            <p className="text-sm font-medium mt-2">Conexión Segura</p>
            <div className="mt-4 h-2 w-full bg-primary/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[100%] animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}