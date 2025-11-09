"use client";

import { signOut } from "next-auth/react";

interface LogoutLinkProps {
  userName?: string;
}

export default function LogoutLink({ userName }: LogoutLinkProps) {
  const handleLogOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleLogOut}
      className="hover:underline text-blue-500 bg-transparent border-none cursor-pointer"
    >
      Welcome {userName}, Logout?
    </button>
  );
}
