import { Suspense } from "react";
import EventsList from "./EventList";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoadingPage from "@/Components/LoadingPage";

export async function DashboardShell({
  searchParams,
}: {
  searchParams: Promise<{ page?: number }>;
}) {
  // check if user is logged in
  cookies();
  const session = await auth();
  // redirect if not logged in
  if (!session) redirect("/login");

  // Await params before accessing properties
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
    <Suspense fallback={<LoadingPage />}>
      {/* ✅ Move async work into child */}
      <DashboardShell searchParams={searchParams} />
    </Suspense>
  );
}
