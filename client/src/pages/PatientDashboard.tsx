import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  FileText,
  CreditCard,
  CheckCircle,
  Heart,
  Shield,
} from "lucide-react";
import { format, isAfter } from "date-fns";
import { api } from "../utils/fetch"; // your helper used elsewhere
import Layout from "../components/Layout";
import { Route, Routes } from "react-router-dom";
import MedicalRecords from "./MedicalRecords";
import Doctors from "./Doctors";
import ProfilePage from "./ProfilePage";

const parseNumber = (v: any) => {
  if (v === undefined || v === null) return null;
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
};

const evaluateVitalStatus = (key: string, value: string | number) => {
  // Return 'normal'|'high'|'low' to style badges — simple heuristics
  if (value === null || value === undefined || value === "") return "unknown";
  const valStr = String(value);

  if (key === "bloodPressure" || key === "blood_pressure") {
    // Expect "systolic/diastolic" like "120/80"
    const parts = valStr.split("/").map((p) => parseNumber(p));
    const systolic = parts[0];
    const diastolic = parts[1];
    if (systolic == null) return "unknown";
    if (systolic >= 140 || diastolic >= 90) return "high";
    if (systolic < 90 || diastolic < 60) return "low";
    return "normal";
  }

  if (key === "heartRate" || key === "heart_rate" || key === "hr") {
    const hr = parseNumber(valStr);
    if (hr == null) return "unknown";
    if (hr > 100) return "high";
    if (hr < 60) return "low";
    return "normal";
  }

  if (key === "temperature" || key === "temp") {
    const t = parseNumber(valStr);
    if (t == null) return "unknown";
    // Accept either Celsius or Fahrenheit — if >45 assume F (unlikely)
    if (t >= 38 || t >= 100.4) return "high";
    if (t < 35) return "low";
    return "normal";
  }

  // default: no judgement for weight/height
  return "normal";
};

const statusToBadge = (status: string) => {
  switch (status) {
    case "normal":
      return "text-green-600 bg-green-100";
    case "high":
      return "text-red-600 bg-red-100";
    case "low":
      return "text-blue-600 bg-blue-100";
    case "unknown":
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const PatientOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Live data
  const [nextAppointment, setNextAppointment] = useState<any | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [vitals, setVitals] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  // UI derived values
  const medicalRecordsCount = records.length;
  const pendingPaymentsTotal = useMemo(() => {
    return payments
      .filter((p) => p.status !== "paid" && p.status !== "completed")
      .reduce((s, p) => s + (Number(p.amount) || 0), 0);
  }, [payments]);

  const healthScore = useMemo(() => {
    if (dashboardStats?.healthScore) return dashboardStats.healthScore;
    if (!vitals.length) return null;
    // crude heuristic: if latest BP/HR/temp are normal => high score
    const latest = vitals
      .slice()
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
    if (!latest) return 80;
    const vs = latest.vitalSigns || {};
    let score = 90;
    const bpStatus = evaluateVitalStatus(
      "bloodPressure",
      vs.bloodPressure || vs.bp
    );
    const hrStatus = evaluateVitalStatus(
      "heartRate",
      vs.heartRate || vs.hr || vs.pulse
    );
    const tempStatus = evaluateVitalStatus(
      "temperature",
      vs.temperature || vs.temp
    );

    [bpStatus, hrStatus, tempStatus].forEach((s) => {
      if (s === "high" || s === "low") score -= 15;
    });
    return Math.max(30, score);
  }, [vitals, dashboardStats]);

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter((a) => {
        try {
          const date = a.date ? new Date(a.date) : null;
          return date && isAfter(date, new Date());
        } catch {
          return false;
        }
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 6);
  }, [appointments]);

  const recentRecords = useMemo(() => {
    return records
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [records]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [
          nextAppResp,
          myAppsResp,
          recordsResp,
          dashboardResp,
          paymentsResp,
        ] = await Promise.all([
          api.get("/appointments/next").catch(() => null),
          api.get("/appointments/mine").catch(() => []),
          api.get("/medical-records").catch(() => []),
          api.get("/dashboard/stats").catch(() => null),
          api.get("/payments").catch(() => []),
        ]);

        if (!mounted) return;

        if (nextAppResp && typeof nextAppResp === "object")
          setNextAppointment(nextAppResp);
        if (Array.isArray(myAppsResp)) setAppointments(myAppsResp);
        if (Array.isArray(recordsResp)) setRecords(recordsResp);
        if (Array.isArray(paymentsResp)) setPayments(paymentsResp);
        if (dashboardResp) setDashboardStats(dashboardResp);

        // Derive patientId
        let patientId: string | undefined;
        if (nextAppResp && nextAppResp.patientId && nextAppResp.patientId._id) {
          patientId = nextAppResp.patientId._id;
        } else if (dashboardResp?.patientId) {
          patientId = dashboardResp.patientId;
        } else if (recordsResp?.length > 0) {
          const first = recordsResp[0];
          patientId = first?.patientId?._id || first?.patientId?.id;
        }

        if (patientId) {
          // your controller returns array of records with vitalSigns property
          const vitalsResp =
            (await api
              .get(`/medical-records/vitals/${patientId}`)
              .catch(() => null)) ||
            (await api
              .get(`/medical-records/vitals?patientId=${patientId}`)
              .catch(() => null));
          if (vitalsResp && Array.isArray(vitalsResp)) {
            // ensure each item has date parsed
            const normalized = vitalsResp.map((r: any) => ({
              ...r,
              date: r.date ? new Date(r.date).toISOString() : r.date,
              vitalSigns: r.vitalSigns || r.vitalSigns || r.vitals || {},
            }));
            setVitals(normalized);
          }
        }
      } catch (err) {
        console.error("PatientOverview load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard…</div>;
  }

  // pick most recent vitals entry (if any)
  const latestVitalsEntry = vitals
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  // safe-read fields from latestVitalsEntry.vitalSigns
  const vs = latestVitalsEntry?.vitalSigns || {};

  const vitalsDisplayOrder = [
    {
      key: "bloodPressure",
      label: "Blood Pressure",
      value: vs.bloodPressure || vs.bp || "-",
    },
    {
      key: "heartRate",
      label: "Heart Rate",
      value: vs.heartRate || vs.hr || vs.pulse || "-",
    },
    {
      key: "temperature",
      label: "Temperature",
      value: vs.temperature || vs.temp || "-",
    },
    { key: "weight", label: "Weight (kg)", value: vs.weight || "-" },
    { key: "height", label: "Height (cm)", value: vs.height || "-" },
  ];

  // Top cards
  const cards = [
    {
      title: "Next Appointment",
      value: nextAppointment
        ? `${format(new Date(nextAppointment.date), "MMM d, h:mm a")}`
        : "No upcoming",
      subtitle: nextAppointment
        ? nextAppointment.doctorId?.name || nextAppointment.doctor
        : "—",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Pending Payments",
      value: `KSh ${pendingPaymentsTotal.toLocaleString()}`,
      subtitle: `${
        payments.filter((p) => p.status !== "paid").length
      } invoices`,
      icon: CreditCard,
      color: "bg-red-500",
    },
    {
      title: "Medical Records",
      value: `${medicalRecordsCount}`,
      subtitle: "Total records",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      title: "Health Score",
      value: healthScore !== null ? `${healthScore}%` : "—",
      subtitle:
        healthScore !== null ? (healthScore > 80 ? "Good" : "Monitor") : "",
      icon: Heart,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Health Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 card-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vital Signs */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Vital Signs</h3>
            <Shield className="h-5 w-5 text-green-500" />
          </div>

          <div className="space-y-4">
            {!latestVitalsEntry && (
              <p className="text-sm text-gray-500">No vitals found.</p>
            )}

            {latestVitalsEntry && (
              <>
                <p className="text-sm text-gray-500">
                  Latest:{" "}
                  {latestVitalsEntry.date
                    ? format(new Date(latestVitalsEntry.date), "PPP")
                    : "—"}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {vitalsDisplayOrder.map((item) => {
                    const status = evaluateVitalStatus(item.key, item.value);
                    const badge = statusToBadge(status);
                    return (
                      <div key={item.key} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600">
                              {item.label}
                            </p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                              {item.value ?? "-"}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${badge}`}
                            >
                              {status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Show full history of vitals entries if you want */}
                {vitals.length > 1 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      History
                    </p>
                    <div className="space-y-2 max-h-40 overflow-auto">
                      {vitals
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .map((entry: any) => (
                          <div
                            key={entry.id || entry._id}
                            className="p-2 rounded-lg bg-white border border-gray-100"
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-700">
                                {entry.date
                                  ? format(new Date(entry.date), "PPP")
                                  : "—"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {entry.vitalSigns?.bloodPressure || "-"} •{" "}
                                {entry.vitalSigns?.heartRate || "-"} bpm
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Upcoming Appointments
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Book New
            </button>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.length === 0 && (
              <p className="text-sm text-gray-500">No upcoming appointments</p>
            )}
            {upcomingAppointments.map((appointment: any) => {
              const dateStr = appointment.date
                ? format(new Date(appointment.date), "yyyy-MM-dd")
                : appointment.date;
              return (
                <div
                  key={appointment._id || appointment.id || dateStr}
                  className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors"
                >
                  {appointment.doctorId?.avatar ? (
                    <img
                      src={
                        appointment.doctorId?.avatar ||
                        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                      }
                      alt={appointment.doctorId?.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <p className="h-8 w-8 rounded-full bg-gray-400 text-white text-center flex justify-center items-center font-semibold">
                      {appointment.doctorId?.name.slice(0, 2)}
                    </p>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.doctorId?.name || appointment.doctor}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.doctorId?.department ||
                            appointment.specialty ||
                            ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.date
                            ? format(new Date(appointment.date), "MMM d")
                            : appointment.date}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.time || ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {appointment.type || "Consultation"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {appointment.location || appointment.room || ""}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Medical Records */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Medical Records
          </h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Doctor
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Result
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No records
                  </td>
                </tr>
              )}
              {recentRecords.map((record: any) => (
                <tr
                  key={record._id || record.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {record.date
                      ? format(new Date(record.date), "yyyy-MM-dd")
                      : record.date}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {record.type || record.test || "Record"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {record.doctorId?.name || record.doctor}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {record.result || record.notes || "-"}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {record.status || "completed"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  return (
    <Layout title="Patient Dashboard">
      <Routes>
        <Route path="/" element={<PatientOverview />} />
        <Route path="/records" element={<MedicalRecords />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Layout>
  );
};

export default PatientDashboard;
