import { Suspense } from "react";
import EventsList from "./EventList";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // ✅ Await the Promise version of searchParams
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Events</h1>

      {/* ✅ The key ensures it refetches when page changes */}
      <Suspense key={currentPage} fallback={<p>Loading events...</p>}>
        <EventsList currentPage={currentPage} />
      </Suspense>
    </main>
  );
}
