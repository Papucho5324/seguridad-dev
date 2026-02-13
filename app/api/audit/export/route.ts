import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const filters = await req.json();

  const logs = await prisma.auditLog.findMany({
    where: filters,
    include: { user: { select: { username: true } } },
    orderBy: { createdAt: "desc" },
  });

  const csv = [
    "Acción,Usuario,Entidad,Fecha",
    ...logs.map(
      (l) =>
        `${l.action},${l.user?.username ?? "Sistema"},${l.entity},${l.createdAt.toISOString()}`
    ),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=audit-log.csv",
    },
  });
}
