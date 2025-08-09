import paymentModel from "../models/payment.model.js";
import { stkPush } from "../utils/mpesa.js";

export const initiatePayment = async (req, res) => {
  const { phone, amount } = req.body;
  try {
    const response = await stkPush({ phone, amount });
    if (res.ok) {
      const payment = new paymentModel({ ...req.body });
      await payment.save();
      res.status(201).json(payment);
    }
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Payment failed", error: err.message });
  }
};

// export const createPayment = async (req, res) => {
//   try {
//     const payment = new paymentModel({ ...req.body });
//     await payment.save();
//     res.status(201).json(payment);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

export const getPayments = async (req, res) => {
  const payments = await paymentModel.find();
  res.json(payments);
};

// weekly graph
export const monthlyRevenue = async (req, res) => {
  try {
    // /api/dashboard/graph/monthly-revenue
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // beginning of the month

    const revenueStats = await paymentModel.aggregate([
      {
        $match: {
          date: { $gte: sixMonthsAgo },
          status: "paid",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

     const weeklyData = Array.from({ length: 6 }, (_, i) => {
      //  const date = new Date(sixMonthsAgo);

       console.log(sixMonthsAgo);
      //  date.setDate(date.getDate() + i);
      //  const formatted = date.toISOString().split("T")[0];
      //  const entry = revenueStats.find((d) => d._id === formatted);
      //  return { date: formatted, count: entry?.count || 0 };
     });
    res.json({
      revenueStats:weeklyData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Monthly revenue data fetch error" });
  }
};
