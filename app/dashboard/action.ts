"use server";

import { db } from "@/db";
import { habitsLogTable } from "@/db/schema";
import { cookies } from "next/headers";
import { decrypt } from "../lib/session";
import { between, eq, and } from "drizzle-orm";

/**
 *@description get the habits log for the logged user
 * @param from start date to get the habits log
 * @param to end date where the last log should be picked from
 * @returns habits id and date for the logged user
 */
export async function getHabitsLog(from: string, to: string) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  const habits = await db
    .select({ id: habitsLogTable.id, date: habitsLogTable.date })
    .from(habitsLogTable)
    .where(
      and(
        eq(habitsLogTable.user_id, session!.userId),
        between(habitsLogTable.date, from, to)
      )
    );
  console.log(habits);
  return habits;
}
