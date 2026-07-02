import dotenv from "dotenv";
import path from "path";

// Roda ANTES de qualquer arquivo de teste ser importado — garante que o
// Prisma Client (instanciado no import de src/lib/prisma.ts) já enxergue a
// DATABASE_URL do banco de TESTE, e não a do banco de desenvolvimento.
dotenv.config({ path: path.resolve(__dirname, "../.env.test"), override: true });
