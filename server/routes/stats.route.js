import express from "express";
import {
  adminOnly,
  adminOrdoctorOnly,
  doctorOnly,
  protect,
} from "../middleware/authMiddleware.js";
import { getDoctorStats, getStats } from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/", protect,adminOrdoctorOnly, getStats);
router.get("/doctor",protect,adminOrdoctorOnly,getDoctorStats )

export default router;
