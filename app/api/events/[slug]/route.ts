import connectDB from "@/lib/mongodb";
import { Event } from "@/database";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
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
    const event = await Event.findOne({ slug }).select("-__v").lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { error: "Event not found in Database" },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 }
    );
  } catch (error) {
    // Log error for monitoring but don't expose details
    console.error("Error fetching event:", error);

    return NextResponse.json(
      { error: "Failed to fetch event details" },
      { status: 500 }
    );
  }
}

// delete event by slug (Delete Method)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // get the slug
    const { slug } = await params;
    // validate slug
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Invalid event slug" },
        { status: 400 }
      );
    }
    // connect to mongoDB
    await connectDB();
    // delete the event
    const deleteEventBySlug = await Event.deleteOne({ slug });
    // return the response
    return NextResponse.json(
      {
        message: `Event with slug : ${slug} deleted successfully`,
        deleteEventBySlug,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for monitoring but don't expose details
    console.error("Error deleting event:", error);
    // return the error message
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

// Update event by Slug (Put Method)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // get the slug
    const { slug } = await params;
    // validate the slug
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { message: "Invalid event slug" },
        { status: 400 }
      );
    }
    // connect to mongoDB
    await connectDB();

    // get the formdata from the request
    const formData = await request.formData();
    // make a variable to store the data event
    let event;
    // entries all the formData into event variable
    try {
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 }
      );
    }

    // checking the image file new or not
    const existingEvent = await Event.findOne({ slug });
    // store all the old data (because using findOneAndReplace to update the data)
    event.slug = existingEvent.slug;
    event.__v = existingEvent.__v;

    // if a new image file is uploaded
    if (event.image && typeof event.image !== "string") {
      // get the image file
      const image = event.image as File;
      // convert the image file to buffer
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // delete the old image from cloudinary
      if (existingEvent.image) {
        const publicId = existingEvent.image.split("/").pop()?.split(".")[0];
        await cloudinary.uploader.destroy(`DevEvent/${publicId}`);
      }

      // upload the new image to cloudinary
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
      // get the new image url and update the event.image
      event.image = (uploadResult as { secure_url: string }).secure_url;
    }

    //if the title changed generate new slug
    // helper function to generate URL-friendly slug
    const generateSlug = (title: string): string => {
      return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
    };
    // detected the title changed
    if (
      typeof event.title === "string" &&
      event.title !== existingEvent.title
    ) {
      event.slug = generateSlug(event.title);
    }

    // update the event's data by slug
    const updatedEventBySlug = await Event.findOneAndReplace({ slug }, event, {
      new: true,
    });
    // return the response
    return NextResponse.json(
      {
        message: `Event with slug : ${slug} updated successfully`,
        updatedEventBySlug: updatedEventBySlug,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Log error for monitoring but don't expose details
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
