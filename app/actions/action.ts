"use server";

import { db } from "@/db";
import { habitsTable } from "@/db/schema";
import { cookies } from "next/headers";
import { decrypt } from "../lib/session";

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
