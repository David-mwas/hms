export type Appointment = {
  _id: string;
  doctorId: {
    _id: string;
    name: string;
    email: string;
  };
  patientId: {
    _id: string;
    name: string;
    email: string;
  };
  date: string;
  time: string;
  reason: string;
  status: "pending" | "confirmed" | "canceled" | "rescheduled";
  createdAt: string;
  updatedAt: string;
  __v: number;
  type: "consultation" | "follow-up" | "check-up" | "emergency";
};
