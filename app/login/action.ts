"use server";

import { usersTable } from "@/db/schema";
import { FormState, LoginFormSchema } from "./definition";
import { db } from "@/db";
import * as crypto from "crypto";
import { eq } from "drizzle-orm";
import { createSession } from "../lib/session";
import { redirect } from "next/navigation";

export async function login(state: FormState, formData: FormData) {
  const validateFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors };
  }

  const { email, password } = validateFields.data;

  const user = await db
    .select({ id: usersTable.id, hash: usersTable.hash, salt: usersTable.salt })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user) {
    return {
      message: "User not found",
    };
  }

  const validPassword = validatePassword(password, user[0].hash, user[0].salt);

  if (!validPassword) {
    return {
      message: "Invalid password",
    };
  }

  await createSession(user[0].id);
  redirect("/");
}

function validatePassword(password: string, hash: string, salt: string) {
  const checkHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return hash === checkHash;
}
