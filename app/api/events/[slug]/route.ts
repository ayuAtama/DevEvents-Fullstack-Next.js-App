import connectDB from "@/lib/mongodb";
import { Event } from "@/database";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Validate slug parameter
    const { slug } = await params;
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Invalid event slug" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find event by slug
    const event = await Event.findOne({ slug }).select("-__v");

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { error: "Event not found in Database" },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    // Log error for monitoring but don't expose details
    console.error("Error fetching event:", error);

    return NextResponse.json(
      { error: "Failed to fetch event details" },
      { status: 500 }
    );
  }
}
