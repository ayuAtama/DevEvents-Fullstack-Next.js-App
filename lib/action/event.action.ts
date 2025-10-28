"use server";

import Event, { IEvent } from "@/database/event.model";
import connectDB from "../mongodb";
import { Types } from "mongoose";

export const getSimilarEventsBySlug = async (
  slug: IEvent["slug"]
): Promise<IEvent[]> => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug });

    if (!event) return [];

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();

    // Convert ObjectId to string with proper typing
    return similarEvents.map((event) => ({
      ...event,
      _id: (event._id as Types.ObjectId).toString(),
    })) as IEvent[];
  } catch {
    return [];
  }
};
