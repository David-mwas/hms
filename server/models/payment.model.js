import mongoose, { Schema } from "mongoose";

const PaymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  appointment: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "overdue"],
    default: "pending",
  },
  service: String,
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: { type: String, required: true },
});

export default mongoose.model("Payment", PaymentSchema);
  