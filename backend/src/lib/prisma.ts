import { PrismaClient } from "../generated/prisma/client";

// Instância única do Prisma Client (padrão Singleton).
// Evita abrir várias conexões com o banco quando o hot-reload recarrega o servidor.
export const prisma = new PrismaClient();
