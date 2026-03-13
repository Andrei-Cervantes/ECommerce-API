import User from "../models/User.js";
import auth from "../auth.js";
import bcrypt from "bcrypt";

// Constants
const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email) => EMAIL_REGEX.test(email);
const isValidPassword = (password) =>
  password && password.length >= MIN_PASSWORD_LENGTH;

const userController = () => {
  // POST /auth/register
  const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({
          error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
        });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      return res.status(201).json({ message: "Registered successfully" });
    } catch (err) {
      console.error("[registerUser]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // POST /auth/login
  const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        // Avoid leaking whether the email exists
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      return res.status(200).json({
        accessToken: auth().createAccessToken(user),
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
        },
      });
    } catch (err) {
      console.error("[loginUser]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // PATCH /users/password
  const updatePassword = async (req, res) => {
    const { password } = req.body;

    if (!isValidPassword(password)) {
      return res
        .status(400)
        .json({
          error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
        });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const updated = await User.findByIdAndUpdate(
        req.user.id,
        { password: hashedPassword },
        { new: true },
      );

      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      console.error("[updatePassword]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // GET /users/profile
  const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error("[getProfile]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // PATCH /users/:userId/set-admin
  const setUserAsAdmin = async (req, res) => {
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Forbidden: admin access required" });
    }

    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { isAdmin: true },
        { new: true },
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User promoted to admin successfully" });
    } catch (err) {
      console.error("[setUserAsAdmin]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  return {
    registerUser,
    loginUser,
    updatePassword,
    getProfile,
    setUserAsAdmin,
  };
};

export default userController;
