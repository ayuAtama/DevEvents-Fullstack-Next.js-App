"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/auth"; // exported from auth.ts

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // call the signIn helper for credentials provider
    // redirect: false so we can handle result client-side
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    } as any);

    // result may be an object; in v5 it can contain ok/error etc.
    // handle it simply for the demo:
    // if signIn returns an object with ok: true -> redirect
    // otherwise show error
    // (some implementations return { error } via query string instead)
    if ((result as any)?.ok || !(result as any)?.error) {
      // success: navigate to protected page or home
      router.push("/");
    } else {
      setError((result as any).error || "Invalid credentials");
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: "2rem auto" }}>
      <h1>Sign in</h1>
      <form onSubmit={submit}>
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            required
          />
        </label>
        <br />
        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            required
          />
        </label>
        <br />
        <button type="submit">Sign in</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <p>Demo users: alice/password123, bob/hunter2</p>
    </main>
  );
}
