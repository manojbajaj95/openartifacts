import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { artifacts, feedback } from "./schema";

function databaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }
  return url;
}

function getDb() {
  const globalForDb = globalThis as typeof globalThis & {
    __oa_pg?: ReturnType<typeof postgres>;
    __oa_db?: ReturnType<typeof drizzle<typeof schema>>;
  };

  if (!globalForDb.__oa_db) {
    const client = postgres(databaseUrl(), { max: 10 });
    globalForDb.__oa_pg = client;
    globalForDb.__oa_db = drizzle(client, { schema });
  }

  return globalForDb.__oa_db;
}

export async function insertArtifact(data: typeof artifacts.$inferInsert): Promise<void> {
  await getDb().insert(artifacts).values(data);
}

export async function getArtifact(id: string) {
  const rows = await getDb().select().from(artifacts).where(eq(artifacts.id, id)).limit(1);
  return rows[0];
}

export async function insertFeedback(data: typeof feedback.$inferInsert) {
  const rows = await getDb().insert(feedback).values(data).returning();
  return rows[0]!;
}

export async function listFeedback(artifactId: string) {
  return getDb()
    .select()
    .from(feedback)
    .where(eq(feedback.artifactId, artifactId))
    .orderBy(asc(feedback.createdAt));
}
