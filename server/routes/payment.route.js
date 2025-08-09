import express from "express";
import {
  getPayments,
  initiatePayment,
  monthlyRevenue,
} from "../controllers/payment.controller.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();
router.post("/stk", protect, initiatePayment);
router.get("/", protect, getPayments);

router.get("/monthly", protect, monthlyRevenue);

export default router;
