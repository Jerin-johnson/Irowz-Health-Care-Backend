import { Schema, model, Types } from "mongoose";

export interface NotificationDocument {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;

  type: string; // CONSULTATION_STARTED, SLOT_BOOKED, etc.
  title: string;
  message: string;

  metadata?: Record<string, any>;

  isRead: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

export const NotificationModel = model<NotificationDocument>("Notification", NotificationSchema);
