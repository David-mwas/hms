import express from "express";
import {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  approveAppointment,
  updateAppointmentStatus,
  getAllAppointments,
  getTodaysAppointments,
  // getRecentAppointments,
  getNextAppointment,
  // getDashboardAppointmets,
  getWeeklyAppointments,
  dailyAppointments,
} from "../controllers/appointment.controller.js";
import {
  adminOnly,
  adminOrdoctorOnly,
  doctorOnly,
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAppointment);
router.get("/", protect, adminOnly, getAllAppointments);
router.get("/mine", protect, getMyAppointments);
router.get("/doctor", protect, getDoctorAppointments);
router.put("/:id/approve", protect, approveAppointment);
// router.put("/:id/status", protect, adminOrdoctorOnly, updateAppointmentStatus);
// PATCH for status updates
router.patch(
  "/:id/status",
  protect,
  adminOrdoctorOnly,
  updateAppointmentStatus
);

router.get("/today", protect, getTodaysAppointments);
// router.get("/recent", protect, getRecentAppointments);
router.get("/next", protect, getNextAppointment);
// router.get("/dashboard", protect, getDashboardAppointmets);
router.get("/weekly", protect, getWeeklyAppointments);
router.get("/daily", protect, dailyAppointments);
export default router;
