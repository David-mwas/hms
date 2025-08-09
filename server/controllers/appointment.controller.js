import Appointment from "../models/appointment.model.js";

// get all appointments
export const getAllAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate("doctorId", "name email")
    .populate("patientId", "name email");
  res.json(appointments);
};
export const createAppointment = async (req, res) => {
  const { doctorId, date, time, reason, type } = req.body;

  const appointment = await Appointment.create({
    patientId: req.user._id,
    doctorId,
    date,
    time,
    reason,
    type,
  });
  await appointment.save();

  res.status(201).json(appointment);
};

// user appointments
export const getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({
    patientId: req.user._id,
  }).populate("doctorId", "name email");

  res.json(appointments);
};

// doctor appointments
export const getDoctorAppointments = async (req, res) => {
  const appointments = await Appointment.find({
    doctorId: req.user._id,
  }).populate("patientId", "name email");

  res.json(appointments);
};

export const approveAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: "Not found" });

  appointment.status = "confirmed";
  await appointment.save();
  res.json({ message: "Appointment confirmed" });
};

// export const updateAppointmentStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   const appointment = await Appointment.findById(id);
//   if (!appointment)
//     return res.status(404).json({ message: "Appointment not found" });

//   appointment.status = status;
//   await appointment.save();

//   res.json({ message: "Status updated", appointment });
// };

/**
 * PATCH /api/appointments/:id/status
 * Body: { status: "confirmed"|"cancelled"|"rescheduled"|"completed", date?: "YYYY-MM-DD", time?: "HH:MM" }
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date, time } = req.body;
    console.log(status)

    // basic validation
    const allowedStatuses = [
      "confirmed",
      "cancelled",
      "rescheduled",
      "completed",
      "pending",
    ];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // only doctors or admins can change status (you can adjust logic if patients can cancel)
    if (
      !req.user ||
      !(req.user.role === "doctor" || req.user.role === "admin")
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    // Update status and optionally date/time for reschedule
    appointment.status = status;

    if (status === "rescheduled") {
      if (!date || !time) {
        return res
          .status(400)
          .json({ message: "Reschedule requires date and time" });
      }
      appointment.date = new Date(date); // store as Date object
      appointment.time = time;
      // Optionally mark status as confirmed after reschedule
      // appointment.status = "confirmed";
    } else if (date) {
      // Some other status may accompany a date change
      appointment.date = new Date(date);
    }
    if (time) appointment.time = time;

    await appointment.save();
    const populated =
      (await appointment.populate("patientId doctorId").execPopulate?.()) ||
      appointment;

    res.json({ message: "Status updated", appointment: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
};
export const getTodaysAppointments = async (req, res) => {
  const user = req.user;
  const matchFilter = {}; // filter based on role

  if (user.role === "doctor") matchFilter.doctorId = user._id;
  if (user.role === "patient") matchFilter.patientId = user._id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  try {
    const appointments = await Appointment.find({
      ...matchFilter,
      date: { $gte: today, $lt: tomorrow },
    }).populate("patientId doctorId");

    res.json(appointments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching today’s appointments" });
  }
};

// export const getRecentAppointments = async (req, res) => {
//   try {
//     const user = req.user;
//     const matchFilter = {}; // filter based on role

//     if (user.role === "doctor") matchFilter.doctorId = user._id;
//     if (user.role === "patient") matchFilter.patientId = user._id;
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//     const recentAppointments = await Appointment.find({
//       ...matchFilter,
//       date: { $gte: sevenDaysAgo, $lte: new Date() },
//     })
//       .sort({ date: -1 })
//       .limit(10)
//       .populate("patientId doctorId");

//     res.json(recentAppointments);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching recent appointments" });
//   }
// };

export const getNextAppointment = async (req, res) => {
  const user = req.user;
  const matchFilter = {}; // filter based on role

  if (user.role === "doctor") matchFilter.doctorId = user._id;
  if (user.role === "patient") matchFilter.patientId = user._id;
  try {
    const now = new Date();

    const nextAppointment = await Appointment.findOne({
      ...matchFilter,
      date: { $gt: now },
      status: "confirmed",
      patientId: req.user.id,
    })
      .sort({ date: 1 })
      .populate("patientId doctorId");

    if (!nextAppointment) {
      return res.status(404).json({ message: "No upcoming appointment found" });
    }

    res.json(nextAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching next appointment" });
  }
};

// app.get("/api/dashboard/appointments", authMiddleware,);
// export const getDashboardAppointmets = async (req, res) => {
//   const user = req.user; // from JWT
//   const now = new Date();
//   console.log(user.id);
//   const startOfToday = new Date(now.setHours(0, 0, 0, 0));
//   const endOfToday = new Date(now.setHours(23, 59, 59, 999));

//   const last7Days = new Date();
//   last7Days.setDate(last7Days.getDate() - 6);
//   last7Days.setHours(0, 0, 0, 0);

//   const matchFilter = {}; // filter based on role
//   if (user.role === "doctor") matchFilter.doctorId = user._id;
//   if (user.role === "patient") matchFilter.patientId = user._id;

//   try {
//     // Today’s Appointments
//     const todayAppointments = await Appointment.find({
//       ...matchFilter,
//       date: { $gte: startOfToday, $lte: endOfToday },
//     });

//     // Next Upcoming Appointment
//     const nextAppointment = await Appointment.findOne({
//       ...matchFilter,
//       date: { $gt: new Date() },
//       status: "confirmed",
//     }).sort({ date: 1 });

//     // Recent Appointments (last 7 days)
//     const recentAppointments = await Appointment.find({
//       ...matchFilter,
//       date: { $gte: last7Days, $lte: new Date() },
//     }).sort({ date: -1 });

//     res.json({
//       todayAppointments,
//       nextAppointment,
//       recentAppointments,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Dashboard data fetch error" });
//   }
// };
// controllers/appointment.controller.js (replace getWeeklyAppointments with this)
export const getWeeklyAppointments = async (req, res) => {
  try {
    const user = req.user;
    const matchFilter = {};
    if (user.role === "doctor") matchFilter.doctorId = user._id;
    if (user.role === "patient") matchFilter.patientId = user._id;

    // compute start of current week (Sunday as start)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // exclusive end
    endOfWeek.setHours(0, 0, 0, 0);

    // aggregate appointments for the current week
    const weeklyDataRaw = await Appointment.aggregate([
      {
        $match: {
          ...matchFilter,
          date: { $gte: startOfWeek, $lt: endOfWeek },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // build array for the 7 days in order (startOfWeek -> startOfWeek+6)
    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const found = weeklyDataRaw.find((x) => x._id === iso);
      weeklyData.push({ date: iso, count: found ? found.count : 0 });
    }

    return res.json({ weeklyData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Weekly data fetch error" });
  }
};

// export const getWeeklyAppointments = async (req, res) => {
//   const user = req.user;
//   const matchFilter = {}; // filter based on role
//   if (user.role === "doctor") matchFilter.doctorId = user._id;
//   if (user.role === "patient") matchFilter.patientId = user._id;

//   const last7Days = new Date();
//   last7Days.setDate(last7Days.getDate() -4);
//   last7Days.setHours(0, 0, 0, 0);
//   try {
//     // Weekly Appointments Graph (last 7 days by date)
//     const weeklyDataRaw = await Appointment.aggregate([
//       { $match: { ...matchFilter, date: { $gte: last7Days } } },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$date" },
//           },
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     const weeklyData = Array.from({ length: 7 }, (_, i) => {
//       const date = new Date(last7Days);
//       date.setDate(date.getDate() + i);
//       const formatted = date.toISOString().split("T")[0];
//       const entry = weeklyDataRaw.find((d) => d._id === formatted);
//       return { date: formatted, count: entry?.count || 0 };
//     });

//     res.json({
//       weeklyData,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Weekly data fetch error" });
//   }
// };

export const dailyAppointments = async (req, res) => {
  const days = parseInt(req.query.days) || 7; // default to 7-day trend

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  try {
    const dailyTrends = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Ensure all days are filled even if count is 0
    const trendMap = new Map(dailyTrends.map((item) => [item._id, item.total]));
    const fullTrend = [];

    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split("T")[0]; // yyyy-mm-dd

      fullTrend.push({
        date: dateStr,
        count: trendMap.get(dateStr) || 0,
      });
    }

    res.json(fullTrend);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch daily appointment trends" });
  }
};
