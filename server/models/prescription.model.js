import mongoose from "mongoose";

// const prescriptionSchema = new mongoose.Schema({
//   patientId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   doctorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   date: Date,
//   diagnosis: String,
//   medications: [Object],
//   status: String,
//   refills: Number,
//   nextRefill: Date,
//   additionalNotes: String,
// });

// export default mongoose.model("Prescription", prescriptionSchema);

// models/Prescription.js

const MedicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
  },
  { _id: false }
);

// const PatientSchema = new mongoose.Schema(
//   {
//     name: String,
//     age: Number,
//     id: String,
//     avatar: String,
//   },
//   { _id: false }
// );

const PrescriptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // e.g. RX-001 (client or server can generate)
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientAge: { type: String, default: 0 },
    date: { type: Date, default: Date.now },
    diagnosis: String,
    medications: [MedicationSchema],
    status: { type: String, default: "active" }, // active | completed | expired | pending
    refills: { type: Number, default: 0 },
    nextRefill: Date,
    validUntil: Date,
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", PrescriptionSchema);
