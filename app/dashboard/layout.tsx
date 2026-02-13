// app/dashboard/layout.tsx
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Factory, History, ShieldCheck, LogOut, Target } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Lateral */}
      <aside className="w-64 border-r bg-card/50 backdrop-blur-md p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-bold tracking-tighter text-primary">SafeLink Pro</h2>
          <p className="text-xs text-muted-foreground">ID: 23110805</p>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
            <LayoutDashboard size={20} /> Inicio
          </Link>

          {/* Sección de Producción (Para ambos) */}
          <Link href="/dashboard/production" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
            <Target size={20} /> {isAdmin ? "Reportes HxH" : "Registrar Piezas"}
          </Link>

          {/* SECCIONES EXCLUSIVAS ADMIN */}
          {isAdmin && (
            <>
              <div className="pt-4 pb-2 text-xs font-semibold text-muted-foreground uppercase">Administración</div>
              <Link href="/dashboard/machines" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                <Factory size={20} /> Gestión de Máquinas
              </Link>
              <Link href="/dashboard/audit" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                <ShieldCheck size={20} /> Logs de Seguridad
              </Link>
            </>
          )}
        </nav>

        <div className="pt-4 border-t">
          <p className="text-xs font-medium truncate">{session.user.name}</p>
          <p className="text-[10px] text-muted-foreground mb-4 uppercase">{session.user.role}</p>
          
<form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <button className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg hover:bg-destructive hover:text-white transition-all">
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}