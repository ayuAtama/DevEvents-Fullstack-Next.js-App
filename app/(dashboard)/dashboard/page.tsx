import { Suspense } from "react";
import EventsList from "./EventList";

export async function DashboardShell({
  searchParams,
}: {
  searchParams: Promise<{ page?: number }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  return <EventsList currentPage={currentPage} />;
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: number }>;
}) {
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      {/* ✅ Move async work into child */}
      <DashboardShell searchParams={searchParams} />
    </Suspense>
  );
}
