import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    method: {
      type: String,
      enum: ["mpesa", "card", "bank"],
      required: true,
    },
    transactionCode: String,
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
