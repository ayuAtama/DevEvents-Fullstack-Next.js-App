## DevEvents – Fullstack Next.js App

Discover and manage developer events. Create events with images, browse details, and book spots. Complete authentication system with protected dashboard for event management.

### Tech Stack
- **Next.js 16 (App Router)**, **React 19**, **TypeScript**
- **NextAuth v5** (beta) for authentication with JWT sessions
- **MongoDB + Mongoose 8** for persistence
- **Cloudinary** for image uploads
- **Tailwind CSS 4** for styling
- **React Hook Form + Zod** for form validation
- **React Hot Toast** for notifications
- **SweetAlert2** for confirmations
- Optional: **PostHog** analytics

---

## Project Structure
- `app/`
  - `/page.tsx`: Home page. Fetches events from `GET /api/events` and renders `EventCard`.
  - `/(authentication)/login/page.tsx`: Login page with NextAuth credentials provider.
  - `/(authentication)/forget-password/page.tsx`: Password recovery page (placeholder).
  - `/(dashboard)/dashboard/`: Protected dashboard routes (requires authentication).
    - `page.tsx`: Dashboard home with paginated event list.
    - `EventList.tsx`: Server component for displaying events with pagination.
    - `create-event/page.tsx`, `form.tsx`: Protected form to create events.
    - `edit/[slug]/page.tsx`, `EditForm.tsx`: Protected form to edit events.
  - `/events/[slug]/page.tsx`: Event details, includes `BookEvent` and similar events by tag.
  - `api/[...nextauth]/route.ts`: NextAuth handlers (GET/POST).
  - `api/events/route.ts`: `GET` list events with pagination, `POST` create event (protected).
  - `api/events/dashboard/route.ts`: `GET` paginated events for dashboard.
  - `api/events/[slug]/route.ts`: `GET` single event, `PUT` update event, `DELETE` delete event (protected).
  - `api/bookings/route.ts`: `POST` create a booking.
- `Components/`: UI components (`EventCard`, `BookEvent`, `ExplorerBtn`, `Navbar`, `DeleteButton`, `LogOutLink`, etc.).
- `database/`: Mongoose models (`event.model.ts`, `booking.model.ts`) and re-exports.
- `lib/`: `mongodb.ts` connection cache; server actions in `lib/action/*`.
- `auth.ts`: NextAuth configuration with credentials provider.
- `middleware.ts`: Authentication middleware for protected routes.
- `next.config.ts`: Cloudinary/Unsplash image patterns, PostHog rewrites, React compiler, experimental flags.

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
# MongoDB Connection
MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"

# Cloudinary (use CLOUDINARY_URL for automatic config)
CLOUDINARY_URL="cloudinary://<api_key>:<api_secret>@<cloud_name>"

# Public base URL (used by server components for fetch)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# NextAuth Configuration
AUTH_SECRET="<generate-secret-with-openssl-rand-base64-32>"
NEXTAUTH_URL="http://localhost:3000"

# Optional PostHog
# NEXT_PUBLIC_POSTHOG_KEY="phc_..."
# NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
```

**Note**: Generate `AUTH_SECRET` using:
```bash
npx auth secret
```

### Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "serve": "next build && next start",
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
List all events with pagination (sorted by `createdAt` desc).

Query Parameters:
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 5): Items per page

Response 200:
```json
{
  "events": [
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
  ],
  "total": 53,
  "currentPage": 1,
  "totalPages": 11
}
```

Errors 500:
```json
{ "Message": "Failed to fatch the events", "error": "string" }
```

### GET `/api/events/dashboard`
Get paginated events for dashboard.

Query Parameters:
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 6): Items per page

Response 200: Same format as `GET /api/events`

### POST `/api/events`
Create an event with image upload.
- Content-Type: `multipart/form-data`
- Body fields: `title`, `description`, `overview?`, `image` (File, required), `venue`, `location`, `date` (YYYY-MM-DD), `time` (HH:mm), `mode` (online|offline|hybrid), `audience?`, `organizer`, repeatable `agenda`, repeatable `tags`.

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
- 401: unauthorized (not authenticated)
- 500: Cloudinary/Mongo errors

### GET `/api/events/[slug]`
Fetch a single event by slug.

Response 200:
```json
{ "message": "Event fetched successfully", "event": { "...": "fields" } }
```
Errors: 400 invalid slug, 404 not found, 500 error.

### PUT `/api/events/[slug]`
Update an event by slug (requires authentication).
- Content-Type: `multipart/form-data`
- Body fields: Same as `POST /api/events`, but `image` is optional (only upload if changing image).
- If a new image is uploaded, the old Cloudinary image is automatically deleted.
- If the title changes, a new slug is automatically generated.

Success 200:
```json
{ "message": "Event with slug : dev-summit updated successfully", "updatedEventBySlug": { "...": "updated document" } }
```
Errors: 400 invalid slug/data, 401 unauthorized, 404 not found, 500 error.

### DELETE `/api/events/[slug]`
Delete an event by slug (requires authentication).

Success 200:
```json
{ "message": "Event with slug : dev-summit deleted successfully", "deleteEventBySlug": { "acknowledged": true, "deletedCount": 1 } }
```
Errors: 400 invalid slug, 401 unauthorized, 404 not found, 500 error.

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
Navigation header with authentication-aware links. Shows login/logout based on session state.
- Links: Home, Dashboard, Create Event
- Displays user name and logout button when authenticated

### `DeleteButton`
Client component for deleting events with confirmation dialog.
Props: `{ slug: string }`
- Uses SweetAlert2 for confirmation
- Calls `DELETE /api/events/[slug]`
- Shows toast notifications on success/error

### `LogOutLink`
Client component for logging out users.
Props: `{ userName?: string }`
- Calls NextAuth `signOut()` function
- Clears session and redirects to login

---

## Authentication

### NextAuth Configuration (`auth.ts`)
- **Provider**: Credentials provider with hardcoded demo users (NOT for production)
- **Session Strategy**: JWT
- **Custom Sign In Page**: `/login`
- **Demo Users**:
  - Username: `alice`, Password: `password123`
  - Username: `bob`, Password: `hunter2`

### Protected Routes
- `/dashboard/*` - All dashboard routes require authentication
- `/dashboard/create-event` - Protected
- `/dashboard/edit/[slug]` - Protected
- API routes for creating, updating, and deleting events require authentication

### Middleware
`middleware.ts` exports NextAuth middleware for route protection.

### Login Page
- Located at `/login`
- Uses NextAuth `signIn()` function
- Redirects to `/dashboard` on successful login
- Shows error message for invalid credentials

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

### Authentication
1. Navigate to `/login` or click create event or dashboard
2. Enter credentials (demo: `alice` / `password123`)
3. On success, redirects to `/dashboard`
4. Session persists across page refreshes
5. Logout via navbar logout button

### Create Event (UI)
1. Login to access protected routes
2. Go to `/dashboard/create-event`
3. Fill the form with validation (React Hook Form + Zod)
4. Upload an image (required)
5. Submit; on success you'll see a toast notification and redirect to dashboard

### Edit Event (UI)
1. Login and go to `/dashboard`
2. Click edit on any event card
3. Modify fields (image is optional - only upload if changing)
4. Submit; old image is automatically deleted from Cloudinary if new one uploaded

### Delete Event (UI)
1. Login and go to `/dashboard`
2. Click delete on any event card
3. Confirm deletion in SweetAlert2 dialog
4. Event is deleted and list refreshes automatically

### Create Event (API)
Use multipart/form-data as shown in the `POST /api/events` example above.

### Book Event (UI)
On an event detail page (`/events/[slug]`), submit email via the booking form.

### Book Event (API)
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{ "eventId": "<mongo_id>", "email": "user@example.com" }'
```

---

## Notes & Gotchas
- **Authentication**: Currently uses hardcoded demo users. **DO NOT use in production**. Replace with database-backed authentication or OAuth providers.
- **Protected Routes**: Dashboard routes are protected by NextAuth middleware. Ensure `AUTH_SECRET` and `NEXTAUTH_URL` are set in environment variables.
- **Image Upload**: When editing events, if you upload a new image, the old Cloudinary image is automatically deleted to save storage.
- **Slug Generation**: Event slugs are auto-generated from titles. If title changes during edit, slug is regenerated automatically.
- **Pagination**:
  - Dashboard events use 6 per page
- **Form Validation**: Uses Zod schemas for client and server-side validation. All required fields are validated.
- `audience` is optional in the form but recommended.
- `NEXT_PUBLIC_BASE_URL` should point to your app URL in each environment.
- Unique constraints:
  - `Event.slug` must be unique (derived from `title`).
  - `Booking` enforces one booking per `{eventId, email}`.
- Ensure MongoDB and Cloudinary env vars are present before using creation endpoints.
- React Compiler is enabled in `next.config.ts` for optimized rendering.

---

## Troubleshooting
- **Authentication Issues**:
  - Cannot access dashboard: Ensure you're logged in at `/login`
  - Session not persisting: Check `AUTH_SECRET` is set and valid
  - Redirect loop: Verify `NEXTAUTH_URL` matches your app URL
- **Cloudinary errors**: Verify `CLOUDINARY_URL` and that `image` file is sent.
- **Duplicate key on event creation**: A title may generate an existing slug; tweak the title.
- **Duplicate booking**: Same `eventId` + `email` pair already exists.
- **Image not uploading**: Check file size limits and Cloudinary configuration.
- **Edit form not loading**: Ensure the event slug exists and you're authenticated.
- **Delete not working**: Check browser console for errors and verify authentication.
- **Pagination issues**: Ensure `page` and `limit` query parameters are valid numbers.
