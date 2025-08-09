// File: src/seeder.js
/**
 * Seed script to populate initial users, doctors, patients, appointments, and payments.
 * Run with: npm run seed
 */

import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/user.model.js";
import Appointment from "./models/appointment.model.js";
import Payment from "./models/payment.model.js";

dotenv.config();
const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Appointment.deleteMany();
    await Payment.deleteMany();

    // Create users
    const admin = new User({
      name: "Admin User",
      email: "admin@hospital.com",
      password: "password",
      role: "admin",
    });
    const doctor = new User({
      name: "Dr. Smith",
      email: "doctor@hospital.com",
      password: "password",
      role: "doctor",
    });
    const patient = new User({
      name: "Jane Doe",
      email: "patient@hospital.com",
      password: "password",
      role: "patient",
    });
    await Promise.all([admin.save(), doctor.save(), patient.save()]);

    // Create appointment
    const appt = new Appointment({
      patientId: patient._id,
      doctorId: doctor._id,
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: "10:00 AM",
      reason: "check up",
    });
    await appt.save();

    // Create payment
    const payment = new Payment({
      userId: patient._id,
      appointment: appt._id,
      amount: 150,
      status: "pending",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      method: "mpesa",
    });
    await payment.save();

    console.log("Database seeded!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
