"use server";

import { db } from "@/db";
import { FormState, SignupFormSchema } from "./definitions";
import * as crypto from "crypto";
import { usersTable } from "@/db/schema";
import { createSession } from "../lib/session";
import { redirect } from "next/navigation";

export async function signup(state: FormState, formData: FormData) {
  const validateFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateFields.success) {
    return { errors: validateFields.error.flatten().fieldErrors };
  }

  const { name, email, password } = validateFields.data;

  const { salt, hash } = generatePassword(password);

  const user = {
    name: name,
    email: email,
    password: hash,
    salt: salt,
    hash: hash,
  };

  const response = await db
    .insert(usersTable)
    .values(user)
    .returning({ id: usersTable.id });

  if (!response) {
    return {
      message: "An error occurred while creating your account",
    };
  }
  const userId: number = response[0].id;
  await createSession(userId);
  redirect("/");
}

function generatePassword(password: string) {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return {
    salt: salt,
    hash: genHash,
  };
}
