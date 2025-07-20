import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";

export default async function handler(req, res) {
  // 🔒 Safety check: Only allow this route in a development environment
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: "Not found" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.status(200).json({ user: session.user });
}