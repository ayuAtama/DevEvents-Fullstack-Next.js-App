// app/api/events/route.ts
import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

const allEvents = Array.from({ length: 53 }, (_, i) => ({
  id: i + 1,
  title: `Event #${i + 1}`,
}));

export async function GET(req: Request) {
  // extract query parameters from the frontend url
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");

  console.log("searchParams:", searchParams, "The rest:", page, limit, req.url);

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = allEvents.slice(start, end);

  try {
    // connect to mongoDB
    await connectDB();
    // mongoDB pagination filter
    const mongoPaginated = await Event.find()
      .sort({ createdAt: -1 }) // newest first
      .skip(start)
      .limit(limit);
    const total = await Event.countDocuments();

    // return data response
    const data = {
      events: mongoPaginated,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };

    // log before returning
    console.log("data:", data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    events: paginated,
    total: allEvents.length,
    currentPage: page,
    totalPages: Math.ceil(allEvents.length / limit),
  });
}
