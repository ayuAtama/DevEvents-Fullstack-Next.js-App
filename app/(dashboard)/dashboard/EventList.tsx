import page from "@/app/(root)/about/page";
import Card from "@/Components/DashboardCard";
import { IEvent } from "@/database";
import Link from "next/link";
import { notFound } from "next/navigation";

const itemsPerPage = 6;

async function getEvents(page: number) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(
    `${BASE_URL}/api/events/dashboard?page=${page}&limit=${itemsPerPage}`,
    { cache: "no-store" }
  );
  if (!res.ok) return notFound();
  return res.json();
}

export default async function EventsList({
  currentPage,
}: {
  currentPage: number;
}) {
  const data = await getEvents(currentPage);

  // If currentPage is beyond totalPages (e.g., last event deleted)
  const pageToShow =
    currentPage > data.totalPages ? data.totalPages : currentPage;

  // refetch events for the adjusted page
  const finalData =
    pageToShow !== currentPage ? await getEvents(pageToShow) : data;
  return (
    <>
      <h1 className="text-center">All Events</h1>
      <h3
        className="text-center text-2xl rounded-lg shadow-md"
        style={{ color: "grey" }}
      >
        📊 Total Events: <span className="font-bold">{finalData.total}</span> |
        Total Pages: <span className="font-bold">{finalData.totalPages}</span> |
        Current Page: <span className="font-bold">{finalData.currentPage}</span>
      </h3>

      <div className="flex justify-end mr-10">
        <Link
          href="/dashboard/create"
          className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
        >
          Create an Event
        </Link>
      </div>

      <div className="p-10">
        <div
          className="
          grid 
          gap-6 
          sm:grid-cols-2 
          lg:grid-cols-3
          justify-items-stretch
        "
        >
          {finalData.events.map((card: IEvent, index: number) => (
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
            Page {finalData.currentPage} of {finalData.totalPages}
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
