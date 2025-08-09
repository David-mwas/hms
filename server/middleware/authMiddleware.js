import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  try {
    if (!token) throw new Error("Not authorized, no token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Admin access only" });
};
export const doctorOnly = (req, res, next) => {
  if (req.user && req.user.role === "doctor") next();
  else res.status(403).json({ message: "Doctor access only" });
};

export const adminOrdoctorOnly = (req, res, next) => {
  if (
    (req.user && req.user.role === "doctor") |
    (req.user && req.user.role === "admin")
  )
    next();
  else res.status(403).json({ message: "Admin or Doctor access only" });
};

export const patientOrdoctorOnly = (req, res, next) => {
  if (
    (req.user && req.user.role === "doctor") |
    (req.user && req.user.role === "patient")
  )
    next();
  else res.status(403).json({ message: "Patient or Doctor access only" });
};