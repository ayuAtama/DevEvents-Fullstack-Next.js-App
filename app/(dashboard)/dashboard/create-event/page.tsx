import { Suspense } from "react";
import NewEventFormPage from "./form";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import LoadingPage from "@/Components/LoadingPage";

const AuthWrapper = async () => {
  cookies();
  const session = await auth();

  if (!session) redirect("/login");
  return <NewEventFormPage session={session} />;
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <AuthWrapper />
    </Suspense>
  );
}
