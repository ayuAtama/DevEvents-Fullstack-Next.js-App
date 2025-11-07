"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

interface LogoutLinkProps {
  userName?: string;
}

export default function LogoutLink({ userName }: LogoutLinkProps) {
  const handleLogOut = (e: React.MouseEvent) => {
    e.preventDefault();
    signOut({ callbackUrl: "/" });
  };

  return (
    <Link href="/" onClick={handleLogOut} className="hover:underline">
      Welcome {userName}, Logout?
    </Link>
  );
}
