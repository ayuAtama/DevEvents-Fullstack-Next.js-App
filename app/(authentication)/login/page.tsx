"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // exported from auth.ts
import Link from "next/link";

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
    });

    // result may be an object; in v5 it can contain ok/error etc.
    // handle it simply for the demo:
    // if signIn returns an object with ok: true -> redirect
    // otherwise show error
    // (some implementations return { error } via query string instead)
    if (!result?.error) {
      // success: navigate to protected page or home
      window.location.href = "/dashboard";
      router.refresh();
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <section id="event">
      <div className="details">
        <div className="content">
          <h1 className="leading-normal">Login to Create or Edit a Post</h1>
          <h4>
            Post as many as you want — seriously, go wild, just don't turn our
            server into your personal spam museum. We appreciate the enthusiasm
            (and the attention, of course), so thank you very much for gracing
            us with your oh-so-valuable presence!
          </h4>
        </div>
        <div className="form booking">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Username :</label>
              <input
                className="mt-1 block w-full rounded border px-3 py-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                type="text"
                placeholder="see on github ayuatama"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Type your password here :
              </label>
              <input
                className="mt-1 block w-full rounded border px-3 py-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="*******"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <Link
              href="/forget-password"
              className="flex hover:underline justify-end"
            >
              Forgot your password?
            </Link>

            <button
              type="submit"
              className="w-full rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 hover: cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
