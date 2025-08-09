import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import appointmentRoutes from "./routes/appointment.route.js";
import paymentRoutes from "./routes/payment.route.js";
import statsRoute from "./routes/stats.route.js";
import medicalRecordRoutes from "./routes/records.route.js"
import prescriptionsRoutes from "./routes/prescription.route.js";
import cors from "cors";
import morgan from "morgan";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(morgan("dev")); 
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://hmssys-eight.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // optional if you use cookies/auth headers
  })
);

app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stats", statsRoute);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/prescriptions", prescriptionsRoutes);

// error handling
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
