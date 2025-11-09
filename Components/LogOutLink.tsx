// "use client";

// import { signOut } from "next-auth/react";

// interface LogoutLinkProps {
//   userName?: string;
// }

// export default function LogoutLink({ userName }: LogoutLinkProps) {
//   const handleLogOut = async (e: React.MouseEvent) => {
//     try {
//       e.preventDefault();

//       // 1️⃣ Sign out silently (no redirect)
//       await signOut({ redirect: false });

//       // 2️⃣ Force-delete any leftover cookies (Netlify Edge bug workaround)
//       const cookies = [
//         "__Secure-next-auth.session-token",
//         "next-auth.session-token",
//       ];
//       cookies.forEach((name) => {
//         document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
//       });

//       // 3️⃣ Redirect manually after cleanup
//       window.location.href = "/";
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <button
//       onClick={handleLogOut}
//       className="hover:underline text-blue-500 bg-transparent border-none cursor-pointer"
//     >
//       Welcome {userName}, Logout?
//     </button>
//   );
// }


"use client";

import { signOut } from "next-auth/react";

export default function LogoutLink({ userName }: { userName?: string }) {
  const handleLogOut = async () => {
    try {
      // Tell NextAuth to delete the cookie but don't follow its redirect
      await signOut({ redirect: false });

      // Give the browser a moment to process Set-Cookie deletion
      await new Promise((r) => setTimeout(r, 300));

      // Double-kill any leftover cookies (Netlify edge quirk)
      ["__Secure-next-auth.session-token", "next-auth.session-token"].forEach(
        (n) => {
          document.cookie = `${n}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        }
      );

      // Now redirect to the login page — NOT "/" (since "/" calls auth())
      window.location.replace("/login");
    } catch (e) {
      console.error("Logout error:", e);
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