import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster position="top-right" /> {/* ✅ single Toaster instance */}
      <main>{children}</main>
    </>
  );
}