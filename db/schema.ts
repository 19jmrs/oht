import { integer, text, varchar, pgTable } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  salt: text().notNull(),
  hash: text().notNull(),
});

export const habitsTable = pgTable("habits", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  user_id: integer("user_id").references(() => usersTable.id),
});

export const habitsLogTable = pgTable("habits_log", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  habit_id: integer("habit_id").references(() => habitsTable.id),
  date: text("date").notNull(),
});

export type User = typeof usersTable.$inferSelect;
