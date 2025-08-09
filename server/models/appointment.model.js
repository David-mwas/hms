import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "rescheduled", "completed"],
      default: "pending",
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    reason: { type: String },
    room: String,
    type: {
      type: String,
      enum: ["consultation", "follow-up", "check-up", "emergency"],
      default: "consultation",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
