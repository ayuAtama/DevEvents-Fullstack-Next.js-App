"use client";

import { signOut } from "next-auth/react";

interface LogoutLinkProps {
  userName?: string;
}

export default function LogoutLink({ userName }: LogoutLinkProps) {
  const handleLogOut = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();

      // 1️⃣ Sign out silently (no redirect)
      await signOut({ redirect: false });

      // 2️⃣ Force-delete any leftover cookies (Netlify Edge bug workaround)
      const cookies = [
        "__Secure-next-auth.session-token",
        "next-auth.session-token",
      ];
      cookies.forEach((name) => {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      });

      // 3️⃣ Redirect manually after cleanup
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
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
