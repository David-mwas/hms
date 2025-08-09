import mongoose from "mongoose";
import { VitalsSchema } from "./vital.model.js";

// const medicalRecordSchema = new mongoose.Schema(
//   {
//     patientId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Patient",
//       required: true,
//     },
//     doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     diagnosis: { type: String },
//     treatment: { type: String },
//     notes: { type: String },
//     date: { type: Date, default: Date.now },
//     type: { type: String }, // e.g. "X-Ray", "Blood Test"
//     result: String,
//     status: {
//       type: String,
//       enum: ["completed", "pending"],
//       default: "completed",
//     },
//     department: String,
//     symptoms: [String],
//     vitalSigns: { type: mongoose.Schema.Types.ObjectId, ref: "Vital" },
//     medications: [Object],
//     labTests: [Object],
//     notes: String,
//     followUp: Date,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);

const MedicalRecordSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    type: { type: String, required: true }, // e.g., Consultation, Lab Test
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    department: String,
    diagnosis: String,
    symptoms: [String],
    vitalSigns: VitalsSchema,
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
      },
    ],
    labTests: [
      {
        test: String,
        result: String,
        normalRange: String,
        status: String, // normal, high, low
      },
    ],
    notes: String,
    followUp: Date,
    status: String, // completed, pending, etc.
  },
  { timestamps: true }
);

const MedicalRecord = mongoose.model("MedicalRecord", MedicalRecordSchema);

export default MedicalRecord;
