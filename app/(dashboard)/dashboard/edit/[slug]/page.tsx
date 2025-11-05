// app/dashboard/edit/[slug]/page.tsx

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import EditForm from "./EditForm";

const AuthWrapper = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  cookies();
  const session = await auth();

  if (!session) redirect("/login");

  // Await params before accessing properties
  const { slug } = await params;

  // Fetch event data here in the server component
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${BASE_URL}/api/events/${slug}`, {
    cache: "no-store", // or use Next.js revalidate
  });

  if (!response.ok) {
    redirect("/dashboard"); // or show error page
  }

  const event = await response.json();

  return <EditForm session={session} event={event.event} slug={slug} />;
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto p-6">Loading Edit Page...</div>
      }
    >
      <AuthWrapper params={params} />
    </Suspense>
  );
}
