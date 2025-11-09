import { auth } from "@/auth";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoutLink from "./LogOutLink";

async function Navbar() {
  // check if user is logged in
  //  cookies();
  const session = await auth();

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
          {/* use an external component bcoz to clear cookies as client component */}
          {session && <LogoutLink userName={session.user.name} />}
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
