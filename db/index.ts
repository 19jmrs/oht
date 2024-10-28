import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

if (!process.env.DATABASE_URL) throw new Error("database url not found");

export const db = drizzle(process.env.DATABASE_URL!);
