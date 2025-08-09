import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  updateUserRole,
  deleteUser,
  patientDemographics,
  updateUser,
} from "../controllers/user.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/", protect, getUsers);
router.put("/:id/role", protect, adminOnly, updateUserRole);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);
router.get("/demographics", protect, patientDemographics);

export default router;
