export type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "patient";
  avatar?: string;
  department?: string;
  phone?: string;
  token: string;
  address: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  bloodGroup?: "A+" | "B+" | "B-" | "AB-" | "AB+" | "O+" | "O-";
  consultationFee?: string;
  patients?: number;
  experience?: string;
  qualifications: string;
  licenseNumber: string;
};
