import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      enum: ["website", "call", "email", "referral", "ads"],
      default: "website",
    },

    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "lost"],
      default: "new",
    },

    assignedTo: {
      type: String,
      ref: "User",
    },

    createdBy: {
      type: String,
      ref: "User",
      required: true,
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
