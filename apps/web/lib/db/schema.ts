import { index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const artifacts = pgTable("artifacts", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  kind: text("kind").notNull(),
  size: integer("size").notNull().default(0),
  sha256: text("sha256"),
  s3Key: text("s3_key").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
});

export const feedback = pgTable(
  "feedback",
  {
    id: serial("id").primaryKey(),
    artifactId: text("artifact_id")
      .notNull()
      .references(() => artifacts.id),
    author: text("author").notNull().default(""),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => [index("idx_feedback_artifact").on(table.artifactId)],
);

export type ArtifactRow = typeof artifacts.$inferSelect;
export type FeedbackRow = typeof feedback.$inferSelect;
