// app/dashboard/page.tsx
import { Suspense } from "react";
import { auth } from "@/auth";
import { cacheLife } from "next/cache";

// ✅ Cached part (static UI)
async function CachedDashboardContent({ session }: { session: any }) {
  "use cache"; // must be first line
  cacheLife("hours");

  return (
    <div>
      <h1>Welcome, {session.user?.name ?? session.user?.username}</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}

// ✅ Dynamic wrapper to fetch the session
async function SessionLoader() {
  const session = await auth();

  if (!session) {
    return (
      <div>
        Please <a href="/signin">sign in</a> to view the dashboard.
      </div>
    );
  }

  return <CachedDashboardContent session={session} />;
}

// ✅ Main page component — not blocking
export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading your dashboard...</div>}>
      {/* This async component is wrapped, so it won’t block */}
      <SessionLoader />
    </Suspense>
  );
}
