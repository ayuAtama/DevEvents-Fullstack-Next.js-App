// app/dashboard/page.tsx
import { auth } from "@/auth"; // exported from auth.ts

export default async function Dashboard() {
  const session = await auth(); // returns session or null

  if (!session) {
    // show a message or redirect to /signin
    return (
      <div>
        Please <a href="/signin">sign in</a> to view the dashboard.
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name ?? session.user?.username}</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
