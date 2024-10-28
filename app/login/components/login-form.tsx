"use client";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "../action";
import Link from "next/link";
//import Link from "next/link";

export function LoginForm() {
  const [state, action] = useFormState(login, undefined);
  return (
    <form action={action}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="example@mail.com"
        />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <SubmitButton />
      <Link href={"/signup"}>
        <p>Create an account</p>
      </Link>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      Sign In
    </button>
  );
}
