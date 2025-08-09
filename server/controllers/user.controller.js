import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRE,
  });
};

export const registerUser = async (req, res) => {
  const body = req.body;
  const userExists = await User.findOne({ email: body?.email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const user = await User.create(body);
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // console.log(...user)
    res.json({ ...user._doc, token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

export const getUsers = async (req, res) => {
  const role = req.query.role;
  const query = role ? { role } : {};
  const users = await User.find(query).select("-password");
  res.json(users);
};

// Promote or demote a user
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = role;
  await user.save();

  res.json({ message: `User role updated to ${role}` });
};

export const updateUser = async (req, res) => {
  const body = req.body;
  const updated = await User.findByIdAndUpdate(req.params.id, body, {
    new: true,
  });
  await updated.save();
  res.json(updated);
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();
  res.json({ message: "User deleted" });
};

export const patientDemographics = async (req, res) => {
  try {
    const genderStats = await User.aggregate([
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
    ]);

    const ageStats = await User.aggregate([
      {
        $project: {
          age: {
            $floor: {
              $divide: [
                { $subtract: [new Date(), "$dateOfBirth"] },
                1000 * 60 * 60 * 24 * 365,
              ],
            },
          },
        },
      },
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [0, 19, 36, 51, 100],
          default: "Unknown",
          output: {
            count: { $sum: 1 },
          },
          labels: ["0-18", "19-35", "36-50", "51+"],
        },
      },
    ]);

    res.json({
      gender: genderStats,
      ageGroups: ageStats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch patient demographics" });
  }
};
