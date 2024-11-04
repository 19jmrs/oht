"use server";

import { db } from "@/db";
import { habitsLogTable, habitsTable } from "@/db/schema";
import { cookies } from "next/headers";
import { decrypt } from "../lib/session";
import { eq } from "drizzle-orm";
/**
 * Creates a new habit for the logged user in the database
 * @param habitData: string - the name of the habit to be created
 */
export async function createHabit(habitData: string) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session) {
    return {
      message: "You need to be logged in to create a habit",
    };
  }

  if (!habitData) {
    return {
      message: "You need to provide a habit name",
    };
  }

  const habit = {
    name: habitData,
    user_id: session.userId,
  };
  const res = await db
    .insert(habitsTable)
    .values(habit)
    .returning({ id: habitsTable.id });

  if (!res) {
    return {
      message: "An error occurred while creating your habit",
    };
  }

  return {
    message: "200",
  };
}

/**
 *
 * @returns an array of habits for the logged user
 */
export async function getHabits() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session) {
    return [];
  }

  const habits = await db
    .select({
      id: habitsTable.id,
      name: habitsTable.name,
    })
    .from(habitsTable)
    .where(eq(habitsTable.user_id, session.userId));

  return habits;
}

/**
 * @param habitId: - id of the the habit to be tracked
 * @param date: - date when the habit was completed
 * @returns: 200 if it was a success and 500 for the rest
 */
export async function trackHabit(habitId: number, date: string) {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  const habitLog = {
    habit_id: habitId,
    date: date,
    user_id: session!.userId,
  };

  const res = await db
    .insert(habitsLogTable)
    .values(habitLog)
    .returning({ id: habitsLogTable.id });

  if (!res) {
    return {
      message: "500",
    };
  }

  return {
    message: "200",
  };
}
