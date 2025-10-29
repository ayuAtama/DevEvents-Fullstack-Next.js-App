## DevEvents – Fullstack Next.js App

Discover and manage developer events. Create events with images, browse details, and book spots.

### Tech Stack
- **Next.js 16 (App Router)**, **React 19**, **TypeScript**
- **MongoDB + Mongoose 8** for persistence
- **Cloudinary** for image uploads
- **Tailwind CSS 4** for styling
- Optional: **PostHog** analytics

---

## Project Structure
- `app/`
  - `/(root)/page.tsx`: Home page. Fetches events from `GET /api/events` and renders `EventCard`.
  - `/(root)/create-event/page.tsx`, `form.tsx`: Client form to create events (multipart upload to Cloudinary via API).
  - `/events/[slug]/page.tsx`: Event details, includes `BookEvent` and similar events by tag.
  - `api/events/route.ts`: `GET` list events, `POST` create event with image upload.
  - `api/events/[slug]/route.ts`: `GET` single event by slug.
  - `api/bookings/route.ts`: `POST` create a booking.
- `Components/`: UI components (`EventCard`, `BookEvent`, `ExplorerBtn`, `Navbar`, etc.).
- `database/`: Mongoose models (`event.model.ts`, `booking.model.ts`) and re-exports.
- `lib/`: `mongodb.ts` connection cache; server actions in `lib/action/*`.
- `next.config.ts`: Cloudinary/Unsplash image patterns, PostHog rewrites, experimental flags.

---

## Setup

### Prerequisites
- Node.js 18+ LTS
- MongoDB (Atlas or local)
- Cloudinary account (for uploads)

### Install
```bash
pnpm install
# or: npm install / yarn install
```

### Environment Variables
Create `.env.local` in project root:
```bash
MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"

# Cloudinary (use CLOUDINARY_URL for automatic config)
CLOUDINARY_URL="cloudinary://<api_key>:<api_secret>@<cloud_name>"

# Public base URL (used by server components for fetch)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Optional PostHog
# NEXT_PUBLIC_POSTHOG_KEY="phc_..."
# NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
```

### Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

### Run
```bash
pnpm dev
# then visit http://localhost:3000
```

---

## Data Models

### Event (`database/event.model.ts`)
Fields:
- `title` string (required, ≤100)
- `slug` string (unique; generated)
- `description` string (required, ≤1000)
- `overview` string (required, ≤500)
- `image` string (required; Cloudinary URL)
- `venue` string (required)
- `location` string (required)
- `date` string (YYYY-MM-DD; normalized)
- `time` string (HH:MM; normalized)
- `mode` enum: `online | offline | hybrid`
- `audience` string (required)
- `agenda` string[] (≥1)
- `organizer` string (required)
- `tags` string[] (≥1)
Indexes & Hooks:
- Unique `slug`, compound `{date:1, mode:1}`
- Pre-save: slug generation; normalize `date` and `time`

### Booking (`database/booking.model.ts`)
Fields:
- `eventId` ObjectId (ref `Event`, required)
- `email` string (RFC 5322 validation)
Indexes & Hooks:
- Validates referenced Event exists on save
- Indexes: `{eventId}`, `{eventId, createdAt:-1}`, `{email}`, unique `{eventId, email}`

---

## API Reference

### GET `/api/events`
List all events (sorted by `createdAt` desc).

Response 200:
```json
[
  {
    "_id": "673d7...",
    "title": "Dev Summit",
    "slug": "dev-summit",
    "description": "...",
    "overview": "...",
    "image": "https://res.cloudinary.com/.../banner.jpg",
    "venue": "Main Hall",
    "location": "Berlin",
    "date": "2025-11-15",
    "time": "09:30",
    "mode": "hybrid",
    "audience": "Developers",
    "agenda": ["09:30 - Keynote"],
    "organizer": "ACME",
    "tags": ["Cloud", "AI"],
    "createdAt": "2025-10-29T08:00:00.000Z",
    "updatedAt": "2025-10-29T08:00:00.000Z",
    "__v": 0
  }
]
```

Errors 500:
```json
{ "Message": "Failed to fatch the events", "error": "string" }
```

### POST `/api/events`
Create an event with image upload.
- Content-Type: `multipart/form-data`
- Body fields: `title`, `description`, `overview?`, `image` (File), `venue`, `location`, `date` (YYYY-MM-DD), `time` (HH:mm), `mode` (online|offline|hybrid), `audience`, `organizer`, repeatable `agenda`, repeatable `tags`.

Success 201:
```json
{ "message": "Event created successfully", "event": { "...": "created document" } }
```

Client example:
```ts
const form = new FormData();
form.append("title", "My Event");
form.append("description", "Short desc");
form.append("overview", "Long overview");
form.append("image", fileInput.files[0]);
form.append("venue", "Main Hall");
form.append("location", "Berlin");
form.append("date", "2025-11-15");
form.append("time", "09:30");
form.append("mode", "hybrid");
form.append("audience", "Developers");
form.append("organizer", "ACME");
["Intro","Talks"].forEach(a=>form.append("agenda", a));
["Cloud","AI"].forEach(t=>form.append("tags", t));
await fetch("/api/events", { method: "POST", body: form });
```

Errors:
- 400: invalid data or missing `image`
- 500: Cloudinary/Mongo errors

### GET `/api/events/[slug]`
Fetch a single event by slug.

Response 200:
```json
{ "message": "Event fetched successfully", "event": { "...": "fields" } }
```
Errors: 400 invalid slug, 404 not found, 500 error.

### POST `/api/bookings`
Create a booking.
- Content-Type: `application/json`
- Body: `{ "eventId": "<mongo_id>", "email": "user@example.com" }`

Success 201:
```json
{ "booking": { "_id": "...", "eventId": "...", "email": "...", "createdAt": "...", "updatedAt": "..." } }
```
Errors: 404 event not found; 500 on failure or duplicate (unique index).

---

## Components

### `EventCard`
Props: `{ title, image, slug, location, date, time }`

Usage:
```tsx
<EventCard
  title="Dev Summit"
  image="https://res.cloudinary.com/.../banner.jpg"
  slug="dev-summit"
  location="Berlin"
  date="2025-11-15"
  time="09:30"
/>
```

### `ExplorerBtn`
Client button to scroll to events section.
```tsx
<ExplorerBtn />
```

### `BookEvent`
Props: `{ eventId: string; slug: string }` — calls server action to create a booking and emits PostHog event.
```tsx
<BookEvent eventId={event._id} slug={event.slug} />
```

### `Navbar`
Simple navigation header with links to Home/Events/Create Event.

---

## Lib & Server Actions

### `lib/mongodb.ts`
Cached Mongoose connection via global cache.
```ts
import connectDB from "@/lib/mongodb";
await connectDB();
```

### `lib/action/booking.actions.ts`
`createBooking({ eventId, slug, email }): Promise<{ success: boolean }>`
```ts
const { success } = await createBooking({ eventId, slug, email });
```

### `lib/action/event.action.ts`
`getSimilarEventsBySlug(slug: string): Promise<IEvent[]>`
```ts
const similar = await getSimilarEventsBySlug("dev-summit");
```

---

## Configuration

### Images
`next.config.ts` allows Cloudinary and Unsplash hosts via `images.remotePatterns`.

### Cloudinary
`POST /api/events` uses `cloudinary.uploader.upload_stream`. Configure via `CLOUDINARY_URL` or explicit SDK setup.

### Caching
Server components use `"use cache"` and `cacheLife("hours")`. Adjust if you need fresher data.

### PostHog
Rewrites are configured; set public keys in env if using analytics.

---

## Common Workflows

### Create Event (UI)
1. Go to `/create-event`.
2. Fill the form and upload an image.
3. Submit; on success you’ll see a confirmation.

### Create Event (API)
Use multipart/form-data as shown in the `POST /api/events` example above.

### Book Event (UI)
On an event detail page, submit email via the booking form.

### Book Event (API)
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{ "eventId": "<mongo_id>", "email": "user@example.com" }'
```

---

## Notes & Gotchas
- `audience` is required by the Event model; ensure the form provides it.
- `NEXT_PUBLIC_BASE_URL` should point to your app URL in each environment.
- Unique constraints:
  - `Event.slug` must be unique (derived from `title`).
  - `Booking` enforces one booking per `{eventId, email}`.
- Ensure MongoDB and Cloudinary env vars are present before using creation endpoints.

---

## Troubleshooting
- Cloudinary errors during event creation: verify `CLOUDINARY_URL` and that `image` file is sent.
- Duplicate key on event creation: a title may generate an existing slug; tweak the title.
- Duplicate booking: same `eventId` + `email` pair already exists.
