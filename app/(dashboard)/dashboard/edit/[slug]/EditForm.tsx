// app/dashboard/edit/[slug]/EditForm.tsx

"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

// Zod schema for form validation (image is a File now, not a URL)
const EventFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title is required and should be at least 3 characters"),
  description: z.string().min(10, "Short description required (min 10 chars)"),
  overview: z.string().optional().nullable(),
  image: z.any().optional(),
  venue: z.string().min(2, "Venue is required"),
  location: z.string().min(2, "Location is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:mm"),
  mode: z.enum(["online", "offline", "hybrid"]),
  audience: z.string().optional(),
  agenda: z.array(z.string().min(3)).min(1, "Add at least one agenda item"),
  organizer: z.string().min(2, "Organizer is required"),
  tags: z.array(z.string().min(1)).optional(),
});

type EventForm = z.infer<typeof EventFormSchema>;

// Define the props for the NewEventFormPage component
interface EditEventFormPageProps {
  session: {
    user: {
      id: string;
      name?: string;
    };
    expires: string;
  };
  slug: string;
  event: EventForm;
}

export default function EditForm({
  session,
  event,
  slug,
}: EditEventFormPageProps) {
  console.log(session);
  console.log(event);
  console.log(slug);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // Form state
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null
  );
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventForm>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      overview: event.overview,
      venue: event.venue,
      location: event.location,
      date: event.date,
      time: event.time,
      mode: event.mode,
      audience: event.audience,
      agenda: event.agenda,
      organizer: event.organizer,
      tags: event.tags,
    },
  });

  const {
    fields: agendaFields,
    append: appendAgenda,
    remove: removeAgenda,
  } = useFieldArray({ control, name: "agenda" });
  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({ control, name: "tags" });

  async function onSubmit(data: EventForm) {
    setSubmitting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.overview) formData.append("overview", data.overview);

      // check if there is a new image
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]); // real image file
      } else if (event.image) {
        // No new image, keep the old one
        formData.append("image", event.image);
      }

      formData.append("venue", data.venue);
      formData.append("location", data.location);
      formData.append("date", data.date);
      formData.append("time", data.time);
      formData.append("mode", data.mode);
      if (data.audience) formData.append("audience", data.audience);
      formData.append("organizer", data.organizer);

      data.agenda.forEach((item) => formData.append("agenda", item));
      data.tags?.forEach((tag) => formData.append("tags", tag));

      // Use the slug in the URL and correct method
      const res = await fetch(`${BASE_URL}/api/events/${slug}`, {
        method: "PUT",
        body: formData, // multipart/form-data automatically handled
      });

      const payload = await res.json();

      if (!res.ok) {
        setResult({ ok: false, message: payload?.message || "Server error" });
      } else {
        setResult({ ok: true, message: "Event created successfully" });
        reset();
      }
    } catch (err: any) {
      setResult({ ok: false, message: err?.message || "Network error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Edit Your Event Here {session.user.name}!
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            {...register("title")}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Short Description</label>
          <textarea
            {...register("description")}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">
            Overview (optional)
          </label>
          <textarea
            {...register("overview")}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Image File (optional - leave empty to keep current)
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
          {event.image && (
            <div>
              <p className="text-sm text-gray-500 mt-1">Current image:</p>
              <p className="text-sm text-red-300">{event.image}</p>
            </div>
          )}
          {errors.image && (
            <p className="text-sm text-red-600">
              {String(errors.image.message)}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Venue</label>
            <input
              {...register("venue")}
              className="mt-1 block w-full rounded border px-3 py-2"
            />
            {errors.venue && (
              <p className="text-sm text-red-600">{errors.venue.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              {...register("location")}
              className="mt-1 block w-full rounded border px-3 py-2"
            />
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="date-input"
              className="block text-sm font-medium cursor-pointer"
            >
              Date
            </label>
            <div className="relative mt-1">
              <input
                id="date-input"
                type="date"
                {...register("date")}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="block w-full rounded border px-3 py-2 pr-10 cursor-pointer"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="time-input"
              className="block text-sm font-medium cursor-pointer"
            >
              Time
            </label>
            <div className="relative mt-1">
              <input
                id="time-input"
                type="time"
                {...register("time")}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="block w-full rounded border px-3 py-2 pr-10 cursor-pointer"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Mode</label>
            <select
              {...register("mode")}
              className="mt-1 block w-full rounded border px-3 py-2"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Audience (optional)
          </label>
          <input
            {...register("audience")}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Organizer</label>
          <input
            {...register("organizer")}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
          {errors.organizer && (
            <p className="text-sm text-red-600">{errors.organizer.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Agenda</label>
          <div className="space-y-2 mt-2">
            {agendaFields.map((f, idx) => (
              <div key={f.id} className="flex gap-2">
                <input
                  {...register(`agenda.${idx}` as const)}
                  className="flex-1 rounded border px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeAgenda(idx)}
                  className="px-3 py-2 rounded border"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendAgenda("")}
              className="mt-2 px-3 py-2 rounded border"
            >
              Add agenda
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Tags</label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {tagFields.map((t, idx) => (
              <div key={t.id} className="flex items-center gap-2">
                <input
                  {...register(`tags.${idx}` as const)}
                  className="rounded border px-2 py-1"
                />
                <button
                  type="button"
                  onClick={() => removeTag(idx)}
                  className="px-2 py-1 rounded border"
                >
                  x
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendTag("")}
              className="px-3 py-1 rounded border"
            >
              + Tag
            </button>
          </div>
        </div>

        <div className="pt-4 gap-2 flex">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting ? "Updating..." : "Update Event"}
          </button>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50 inline-block"
          >
            Back
          </Link>
        </div>

        {result && (
          <div
            className={`mt-4 p-3 rounded ${
              result.ok ? "bg-blue-200" : "bg-red-200"
            }`}
          >
            <p className="text-sm text-gray-600 ">{result.message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
