import prisma from "../../../src/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { email, password } = req.body;

    // --- 1. Input Validation ---
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    // Password length validation
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    // --- 2. Check for Existing User ---
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists." }); // 409 Conflict is more specific
    }

    // --- 3. Hash Password and Create User ---
    const hashedPassword = await bcrypt.hash(password, 12); // Using a slightly higher cost factor is good practice

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Don't return the user object or password hash
    return res.status(201).json({ message: "Signup successful!" }); // 201 Created

  } catch (error) {
    // --- 4. Robust Error Handling ---
    console.error("❌ Signup Error:", error);
    return res.status(500).json({ error: "An internal server error occurred. Please try again." });
  }
}