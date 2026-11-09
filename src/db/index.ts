import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/aurumend";

// Disable prefetch as it is not supported for "Transaction" pool mode in Supabase/Neon
const client = postgres(connectionString, {
  prepare: false,
  max: 10,
});

export const db = drizzle(client, { schema });
export * from "./schema";

