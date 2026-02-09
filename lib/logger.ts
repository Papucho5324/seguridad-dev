import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createLog(userId: string | null, action: string, entity: string, details?: any) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId === "SYSTEM" || userId === "unknown" ? null : userId,
        action,
        entity,
        details: details || {},
      },
    });
  } catch (error) {
    console.error("Falló el registro de log de auditoría:", error);
  }
}

export async function isUserLocked(username: string) {
  const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);

  const failedAttempts = await prisma.auditLog.count({
    where: {
      action: "LOGIN_FAILED",
      details: {
        path: ["attemptedUsername"],
        equals: username,
      },
      createdAt: {
        gte: sixtySecondsAgo,
      },
    },
  });

  return failedAttempts >= 3;
}