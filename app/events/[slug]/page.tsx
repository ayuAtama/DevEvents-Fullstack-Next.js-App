import { Suspense } from "react";
import EventDetailsPage from "./wrapper";

const page = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <Suspense
      fallback={<div className="max-w-3xl mx-auto p-6">Loading...</div>}
    >
      <EventDetailsPage params={params} />
    </Suspense>
  );
};

export default page;
