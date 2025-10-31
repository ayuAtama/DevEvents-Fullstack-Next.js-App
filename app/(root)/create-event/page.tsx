import { Suspense } from "react";
import NewEventFormPage from "./form";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { cookies } from "next/headers";

const AuthWrapper = async () => {
  cookies();
  const session = await auth();

  if (!session) redirect("/login");
  return <NewEventFormPage session={session}/>;
};

export default function Page() {
  return (
    <Suspense
      fallback={<div className="max-w-3xl mx-auto p-6">Loading...</div>}
    >
      <AuthWrapper />
    </Suspense>
  );
}

// import { Suspense } from "react";
// import NewEventFormPage from "./form";
// import { redirect } from "next/navigation";
// import { auth } from "@/auth";

// const AuthWrapper = async () => {
//   const session = await auth();

//   if (!session) {
//     redirect("/login");
//     return null;
//   }

//   return <NewEventFormPage />;
// };

// const Page = () => {
//   return (
//     <Suspense
//       fallback={<div className="max-w-3xl mx-auto p-6">Loading...</div>}
//     >
//       {/* Suspense wraps the async boundary */}
//       <AuthWrapper />
//     </Suspense>
//   );
// };

// export default Page;

// app/create-event/page.tsx
// import { Suspense } from "react";
// import NewEventFormPage from "./form";
// import { redirect } from "next/navigation";
// import { auth } from "@/auth";

// const Page = async () => {
//   const session = await auth();

//   if (!session) {
//     console.log(session);
//     redirect("/login");
//   }
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <NewEventFormPage />
//     </Suspense>
//   );
// };

// export default Page;
