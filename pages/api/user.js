import prisma from "../../src/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userId = session.user.id;

  switch (req.method) {
    case "GET":
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          // Excellent practice to only select non-sensitive fields
          select: { name: true, avatar: true, email: true },
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        return res.status(500).json({ error: "Failed to fetch user data" });
      }

    case "PUT":
      try {
        const { name, avatar } = req.body;
        const dataToUpdate = {};

        // 1. Validate and build the data object to prevent empty or malicious updates
        if (name && typeof name === 'string' && name.trim().length > 0) {
          dataToUpdate.name = name.trim();
        }

        if (avatar && typeof avatar === 'string') {
          dataToUpdate.avatar = avatar;
        }

        // If no valid data was provided to update, return an error
        if (Object.keys(dataToUpdate).length === 0) {
          return res.status(400).json({ error: "No valid fields provided for update." });
        }

        // 2. Update the user with validated data and select the return fields
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: dataToUpdate,
          select: { name: true, avatar: true }, // 3. Only return safe fields
        });

        return res.status(200).json(updatedUser);
      } catch (error) {
        console.error("❌ Error updating user:", error);
        return res.status(500).json({ error: "Failed to update user" });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}