import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/placeholder";
  const pool = new Pool({
    connectionString,
    max: 5, // Batasi jumlah koneksi per container serverless
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Selalu simpan di globalThis agar container serverless yang hangat (warm lambda) dapat menggunakan kembali koneksi yang sama
globalForPrisma.prisma = prisma;

