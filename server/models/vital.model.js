import mongoose from "mongoose";

// const vitalSchema = new mongoose.Schema(
//   {
//     patientId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     temperature: Number,
//     heartRate: Number,
//     bloodPressure: String,
//     respiratoryRate: Number,
//     weight: Number,
//     height: Number,
//     recordedAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Vital", vitalSchema);

export const VitalsSchema = new mongoose.Schema(
  {
    bloodPressure: { type: String },
    heartRate: { type: String },
    temperature: { type: String },
    weight: { type: String },
    height: { type: String },
  },
  { _id: false }
); // no separate id for embedded schema

export default VitalsSchema;
