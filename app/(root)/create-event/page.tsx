import { Suspense } from "react";
import NewEventFormPage from "./form";

const page = () => {
  return (
    <Suspense
      fallback={<div className="max-w-3xl mx-auto p-6">Loading...</div>}
    >
      <NewEventFormPage />
    </Suspense>
  );
};

export default page;
