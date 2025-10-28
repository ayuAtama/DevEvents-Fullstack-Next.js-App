import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 }
      );
    }

    const file = formData.get("image") as File;
    if (!file)
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );

    // let tags = JSON.parse(formData.get("tags") as string);
    // let agenda = JSON.parse(formData.get("agenda") as string);

    let tags = formData.getAll("tags");
    let agenda = formData.getAll("agenda");

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    // add image URL to event data
    event.image = (uploadResult as { secure_url: string }).secure_url;

    // Create event in parsed tags and agenda
    const createdEvent = await Event.create({
      ...event,
      tags: tags,
      agenda: agenda,
    });
    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      {
        message: "Event creation failed",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        Message: "Failed to fatch the events",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    );
  }
}

// a route that accept a slug as input and return the event details with the slugs
