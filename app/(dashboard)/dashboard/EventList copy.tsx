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
      <ul className="space-y-2">
        {data.events.map((event: any) => (
          <li
            key={event.id}
            className="p-3 rounded bg-gray-100 hover:bg-gray-200 transition"
          >
            {event.title}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-center gap-4 mt-6">
        {currentPage > 1 && (
          <Link
            href={`?page=${currentPage - 1}`}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Previous
          </Link>
        )}

        <span className="text-sm text-gray-700">
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
    </>
  );
}
