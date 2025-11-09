// import { auth } from "@/auth";
// import { cookies } from "next/headers";
// import { Suspense } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import LogoutLink from "./LogOutLink";

// async function Navbar() {
//   // check if user is logged in
//   cookies();
//   const session = await auth();

//   return (
//     <header>
//       <nav>
//         <Link href="/" className="logo">
//           <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
//           <p>DevEvents</p>
//         </Link>

//         <ul>
//           <Link href="/">Home</Link>
//           <Link href="/dashboard">Dashboard</Link>
//           <Link href="/dashboard/create-event" prefetch={false}>
//             Create Event
//           </Link>
//           {/* use an external component bcoz to clear cookies as client component */}
//           {session && <LogoutLink userName={session.user.name} />}
//         </ul>
//       </nav>
//     </header>
//   );
// }

// function SuspenseWrapper() {
//   return (
//     <Suspense
//       fallback={
//         <header>
//           <nav>
//             <Link href="/" className="logo">
//               <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
//               <p>DevEvents</p>
//             </Link>

//             <ul>
//               <Link href="/">Home</Link>
//               <Link href="/dashboard">Dashboard</Link>
//               <Link href="/dashboard/create-event" prefetch={false}>
//                 Create Event
//               </Link>
//             </ul>
//           </nav>
//         </header>
//       }
//     >
//       <Navbar />
//     </Suspense>
//   );
// }

// export default SuspenseWrapper;


import { auth } from "@/auth";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoutLink from "./LogOutLink";
import { headers } from "next/headers";

async function Navbar() {
  cookies();

  // Don't call auth() if we're on /login or being redirected right after sign-out
  const referer = headers().get("referer") || "";
  const url = headers().get("x-pathname") || ""; // may be empty on server, fine fallback
  const isLoginPage = referer.includes("/login") || url.includes("/login");

  let session = null;
  if (!isLoginPage) {
    try {
      session = await auth();
    } catch {
      session = null;
    }
  }

  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>DevEvents</p>
        </Link>

        <ul>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/create-event" prefetch={false}>
            Create Event
          </Link>
          {session && <LogoutLink userName={session.user?.name} />}
        </ul>
      </nav>
    </header>
  );
}

function SuspenseWrapper() {
  return (
    <Suspense
      fallback={
        <header>
          <nav>
            <Link href="/" className="logo">
              <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
              <p>DevEvents</p>
            </Link>
            <ul>
              <Link href="/">Home</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/dashboard/create-event" prefetch={false}>
                Create Event
              </Link>
            </ul>
          </nav>
        </header>
      }
    >
      <Navbar />
    </Suspense>
  );
}

export default SuspenseWrapper;
