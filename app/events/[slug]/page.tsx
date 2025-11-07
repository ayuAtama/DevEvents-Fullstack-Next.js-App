import { Suspense } from "react";
import EventDetailsPage from "./wrapper";
import LoadingPage from "@/Components/LoadingPage";

const page = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <EventDetailsPage params={params} />
    </Suspense>
  );
};

export default page;
