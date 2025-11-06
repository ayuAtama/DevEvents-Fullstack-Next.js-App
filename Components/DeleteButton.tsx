"use client";

import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DeleteButton({ slug }: { slug: string }) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Event deleted successfully!");
      router.refresh(); // Refresh the server-side list
    } catch (err) {
      toast.error("Failed to delete the event");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center 
                 text-white bg-red-600 rounded-lg hover:bg-red-700 
                 focus:ring-4 focus:outline-none focus:ring-red-800"
    >
      Delete the Event
      <svg
        className="w-4 h-4 ms-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 7h12M9 7V4h6v3m2 0v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z"
        />
      </svg>
    </button>
  );
}
