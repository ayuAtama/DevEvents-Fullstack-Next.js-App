// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type User = {
  id: string;
  username: string;
  name?: string;
};

// Demo hard-coded users (DO NOT use this in prod)
const demoUsers: (User & { password: string })[] = [
  { id: "1", username: "alice", password: "password123", name: "Alice" },
  { id: "2", username: "bob", password: "hunter2", name: "Bob" },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  // use JWT sessions for credentials provider
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "alice" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const username = credentials?.username ?? "";
        const password = credentials?.password ?? "";

        // Very simple demo auth: check against demoUsers
        const user = demoUsers.find(
          (u) => u.username === username && u.password === password
        );

        if (!user) {
          // returning null will cause sign in to fail
          return null;
        }

        // return a user object that will be encoded into the JWT/session
        const safeUser = {
          id: user.id,
          name: user.name,
          username: user.username,
        };
        return safeUser;
      },
    }),
  ],

  // Optional: customize pages, callbacks, etc.
  pages: {
    signIn: "/signin",
  },

  // Enable debug only during development
  debug: process.env.NODE_ENV === "development",
});
