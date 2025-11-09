// app/api/auth/[...nextauth]/route.ts
// handle cookies logout
export const runtime = "nodejs";
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
