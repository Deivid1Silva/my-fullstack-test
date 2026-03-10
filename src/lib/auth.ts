import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

// Patrón Singleton para Prisma: Evita errores de inicialización en desarrollo
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
    // Configuración de campos adicionales para cumplir con el requerimiento de ADMIN por defecto
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "ADMIN",
                input: false,
            },
        },
    },
});

export type Session = typeof auth.$Infer.Session;