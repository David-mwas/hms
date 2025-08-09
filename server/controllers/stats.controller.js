// server/controllers/stat.controller.js
import User from "../models/user.model.js";
import Appointment from "../models/appointment.model.js";
import Payment from "../models/payment.model.js";
import prescriptionModel from "../models/prescription.model.js";


// admin dashboard stats
export const getStats = async (req, res) => {
  try {
    const user = req.user;

    // Apply filters if doctor/patient
    const matchFilter = {};
    if (user.role === "doctor") matchFilter.doctorId = user._id;
    if (user.role === "patient") matchFilter.patientId = user._id;

    // Time range
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // --- Counts ---
    const userCount = await User.countDocuments();
    const doctorsCount = await User.countDocuments({ role: "doctor" });
    const patientCount = await User.countDocuments({ role: "patient" });
    const adminCount = await User.countDocuments({ role: "admin" });
    const appointmentCount = await Appointment.countDocuments(matchFilter);

    // --- Recent Appointments (7 days) ---
    const recentAppointments = await Appointment.find({
      ...matchFilter,
      date: { $gte: sevenDaysAgo, $lte: new Date() },
    })
      .sort({ date: -1 })
      .limit(10)
      .populate("patientId doctorId");

    // --- Payment Sum ---
    const paymentSum = (await Payment.find()).reduce(
      (sum, p) => sum + p.amount,
      0
    );

    // --- Payment Method Breakdown ---
    const payments = await Payment.find();
    const methodMap = {};
    payments.forEach((p) => {
      const method = p.method?.toLowerCase() || "unknown";
      methodMap[method] = (methodMap[method] || 0) + 1;
    });
    const paymentMethodData = Object.entries(methodMap).map(
      ([name, value]) => ({ name, value })
    );

    // --- Department ---
    const department = await User.find();
    const departmentMap = {};
    department.forEach((d) => {
      const method = d.department?.toLowerCase() || "unknown";
      departmentMap[method] = (departmentMap[method] || 0) + 1;
    });
    const departmentData = Object.entries(departmentMap).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
    console.log("departmentData", departmentData);

    // --- Patient Demographics ---
    const patients = await User.find({ role: "patient" });
    const demographics = [
      { ageGroup: "0-18", male: 0, female: 0 },
      { ageGroup: "19-35", male: 0, female: 0 },
      { ageGroup: "36-50", male: 0, female: 0 },
      { ageGroup: "51-65", male: 0, female: 0 },
      { ageGroup: "65+", male: 0, female: 0 },
    ];

    const calcAge = (dob) => {
      if (!dob) return null;
      const diff = Date.now() - new Date(dob).getTime();

      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    };

    patients.forEach((patient) => {
      const age = calcAge(patient?.dateOfBirth);
      const gender = patient.gender?.toLowerCase();

      if (
        age !== null &&
        (gender === "male" || gender === "female" || gender === "other")
      ) {
        const group = demographics.find((d) => {
          if (d.ageGroup === "0-18") return age <= 18;
          if (d.ageGroup === "19-35") return age > 18 && age <= 35;
          if (d.ageGroup === "36-50") return age > 35 && age <= 50;
          if (d.ageGroup === "51-65") return age > 50 && age <= 65;
          if (d.ageGroup === "65+") return age > 65;
        });
        if (group) group[gender]++;
      }
    });

    // --- Appointment Trends (today only) ---
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayAppointments = await Appointment.find({
      ...matchFilter,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const appointmentTrends = [
      "8:00",
      "9:00",
      "9:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "2:00",
      "2:30",
      "3:00",
      "3:30",
      "4:00",
      "4:30",
    ].map((hour) => ({
      time: hour,
      appointments: todayAppointments.filter((a) => a.time.startsWith(hour))
        .length,
    }));

    // --- Monthly Revenue (last 6 months) ---
    const paymentsWithDate = await Payment.find({
      date: { $exists: true },
    });

    const monthlyRevenueData = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const from = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const to = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const total = paymentsWithDate
        .filter((p) => p.date >= from && p.date < to)
        .reduce((sum, p) => sum + p.amount, 0);

      monthlyRevenueData.push({
        month: `${from.getMonth() + 1}/${from.getFullYear()}`,
        revenue: total,
      });
    }

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate());
    last7Days.setHours(0, 0, 0, 0);

    // Weekly Appointments Graph (last 7 days by date)
    const weeklyDataRaw = await Appointment.aggregate([
      { $match: { ...matchFilter, date: { $gte: last7Days } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const weeklyAppointmentData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(last7Days);
      date.setDate(date.getDate() + i);
      const formatted = date.toISOString().split("T")[0];
      const entry = weeklyDataRaw.find((d) => d._id === formatted);
      return { date: formatted.slice(8, 10), count: entry?.count || 0 };
    });

    res.json({
      userCount,
      doctorsCount,
      patientCount,
      adminCount,
      appointmentCount,
      paymentSum,
      paymentMethodData,
      patientDemographics: demographics,
      appointmentTrends,
      monthlyRevenueData,
      recentAppointments,
      weeklyAppointmentData,
      departmentData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET doctor today’s dashboard stats
export const getDoctorStats = async (req, res) => {
  const doctorId = req.user.id;
  // console.log(doctorId)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [appointments, prescriptions] = await Promise.all([
    Appointment.find({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("patientId"),
    prescriptionModel.find({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }),
  ]);

  const patientsSeen = appointments.filter(
    (a) => a.status === "completed"
  ).length;
  const pendingReviews = appointments.filter(
    (a) => a.status === "pending"
  ).length;

  const todaySchedule = appointments.map((a) => ({
    id: a._id,
    patient: a.patientId.name,
    type: a.type,
    time: a.date,
    status: a.status,
  }));

  const recentPatients = await Appointment.find({ doctorId })
    .sort({ date: -1 })
    .limit(5)
    .populate("patientId");

  res.json({
    todayAppointments: appointments.length,
    patientsSeen,
    pendingReviews,
    prescriptions: prescriptions.length,
    todaySchedule,
    recentPatients: recentPatients.map((p) => ({
      id: p.patientId._id,
      name: p.patientId.name,
      // condition: "Mock condition", // Replace if you have a health record model

      lastVisit: p.date,
    })),
  });
};
