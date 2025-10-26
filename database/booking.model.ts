import { Schema, model, models, Document, Model, Types } from "mongoose";
import Event from "./event.model";

// Booking document interface
interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Please enter a valid email address",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Verify event exists before saving booking
bookingSchema.pre("save", async function (next) {
  if (this.isModified("eventId")) {
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error("Event does not exist");
    }
  }
  next();
});

// Export the model if it doesn't exist, otherwise use the existing one
const Booking: Model<IBooking> =
  models.Booking || model<IBooking>("Booking", bookingSchema);

export default Booking;
export type { IBooking };
