import Card from "@/Components/DashboardCard";
import { IEvent } from "@/database";
import Link from "next/link";

const itemsPerPage = 6;

async function getEvents(page: number) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(
    `${BASE_URL}/api/events/dashboard?page=${page}&limit=${itemsPerPage}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export default async function EventsList({
  currentPage,
}: {
  currentPage: number;
}) {
  const data = await getEvents(currentPage);

  return (
    <>
      <h1 className="text-center">All Events</h1>
      <div className="p-10">
        <div
          className="
          grid 
          gap-6 
          sm:grid-cols-2 
          lg:grid-cols-3
          justify-items-center
        "
        >
          {data.events.map((card: IEvent, index: number) => (
            <Card key={index} {...card} />
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          {currentPage > 1 && (
            <Link
              href={`?page=${currentPage - 1}`}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Previous
            </Link>
          )}

          <span className="text-sm text-gray-400">
            Page {data.currentPage} of {data.totalPages}
          </span>

          {currentPage < data.totalPages && (
            <Link
              href={`?page=${currentPage + 1}`}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
