import prisma from "../../../src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.error("❌ Unauthorized access attempt");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user?.id;
  if (!userId) {
    console.error("❌ Missing user ID in session:", session);
    return res.status(401).json({ error: "User ID not found in session" });
  }

  if (req.method === "GET") {
    try {
      console.log("✅ Fetching notes for user:", userId);
      const notes = await prisma.note.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(notes);
    } catch (error) {
      console.error("❌ Error fetching notes:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    const { content, color } = req.body; // ✅ Use "content" instead of "text"

    if (!content?.trim()) {
      console.error("❌ Attempt to create empty note");
      return res.status(400).json({ error: "Note content cannot be empty" });
    }

    try {
      console.log("✅ Creating note:", { content, color, userId });
      const newNote = await prisma.note.create({
        data: { content, color: color || "#ffeb3b", userId }, // ✅ Correct field name
      });
      return res.status(201).json(newNote);
    } catch (error) {
      console.error("❌ Error creating note:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
