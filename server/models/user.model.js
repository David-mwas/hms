import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
    },
    department: {
      type: String,
      enum: [
        "Neurology",
        "Cardiology",
        "Orthopedics",
        "Pediatrics",
        "General medicine",
        "Others",
      ],

      default: "General medicine",
    },
    specialization: { type: String }, // For doctors
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: Date },
    phone: { type: String },
    address: { type: String, default: "N/A" },
    // age: { type: Number },
    bloodGroup: {
      type: String,
      enum: ["A-", "A+", "B+", "B-", "AB-", "AB+", "O+", "O-"],
    },
    consultationFee: { type: String, default: 0 },
    patients: { type: String, default: 0 },
    experience: { type: String, default: 0 },
    qualifications: { type: String },
    licenseNumber: { type: String },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
