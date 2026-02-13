import { auth, signOut } from "@/auth";
import RetroGrid from "../components/magicui/retro-grid";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EmailVerificationBanner } from "../components/magicui/email-verification-banner";
import { SuccessConfetti } from "../components/dashboard/success-confetti";
import { Suspense } from "react";
import { LayoutList, TrendingUp, ShieldCheck, Factory } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({ 
    where: { id: session.user.id } 
  });

  if (!user) redirect("/login");

  const isAdmin = user.role === "ADMIN";

  // Consultas específicas para el Operador
  const todayRecords = await prisma.productionRecord.findMany({
    where: {
      userId: user.id,
      createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    },
    include: { machine: true },
    orderBy: { createdAt: 'desc' }
  });

  const totalPiezasTurno = todayRecords.reduce((acc, curr) => acc + curr.piecesProduced, 0);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-background p-6 pt-12">
      <RetroGrid />
      <Suspense fallback={null}><SuccessConfetti /></Suspense>
      
      {!user.emailVerified && <EmailVerificationBanner email={user.email} />}
      
      <div className="z-10 w-full max-w-6xl space-y-8">
        <header className="flex justify-between items-center bg-card/50 p-6 rounded-2xl border border-border backdrop-blur-md shadow-sm">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">Panel de Control</h1>
            <p className="text-muted-foreground text-sm uppercase font-bold text-primary">
              Modo: {user.role}
            </p>
          </div>
          
          <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
            <button className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg hover:bg-destructive hover:text-white transition-all text-sm font-bold">
              Cerrar Sesión
            </button>
          </form>
        </header>

        {/* VISTA PARA EL OPERADOR */}
        {!isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Widget de Total */}
            <div className="bg-primary/10 p-8 rounded-3xl border border-primary/20 backdrop-blur-md flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-primary" />
                <span className="text-sm font-bold uppercase text-muted-foreground">Tu Producción Hoy</span>
              </div>
              <div className="text-5xl font-black text-primary">{totalPiezasTurno}</div>
              <p className="text-xs mt-2 text-muted-foreground">Piezas totales registradas</p>
            </div>

            {/* Resumen de Turno Movido al Inicio */}
            <div className="md:col-span-2 bg-card/50 p-6 rounded-3xl border border-border backdrop-blur-md">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <LayoutList size={18} className="text-primary" /> Historial Reciente
              </h3>
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                {todayRecords.map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-3 border rounded-xl bg-background/50">
                    <span className="text-xs font-bold uppercase">{record.machine.name}</span>
                    <span className="text-sm font-black">{record.piecesProduced} pcs</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(record.hourSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                {todayRecords.length === 0 && (
                  <p className="text-center py-10 text-xs text-muted-foreground italic">
                    No has iniciado registros en este turno.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VISTA PARA EL ADMIN (Métricas Globales) */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-card/50 p-8 rounded-3xl border border-border backdrop-blur-md">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-primary" /> Gestión Administrativa
                </h2>
                <p className="text-sm text-muted-foreground">
                  Como administrador, puedes gestionar las máquinas de la planta y auditar los logs de seguridad desde el menú lateral.
                </p>
             </div>
             <div className="bg-card/50 p-8 rounded-3xl border border-border backdrop-blur-md">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Factory className="text-primary" /> Estado de Planta
                </h2>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Estudiante:</strong> {user.username}</p>
                  <p className="text-sm"><strong>ID:</strong> 23110805</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </main>
  );
}