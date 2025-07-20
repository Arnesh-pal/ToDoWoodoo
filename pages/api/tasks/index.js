import prisma from "../../../src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const userId = session.user.id;

  switch (req.method) {
    case "GET":
      try {
        const tasks = await prisma.task.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(tasks);
      } catch (error) {
        console.error("❌ Prisma Error fetching tasks:", error);
        return res.status(500).json({ error: "Failed to fetch tasks" });
      }

    case "POST":
      try {
        const { title, description, date } = req.body;
        if (!title) {
          return res.status(400).json({ error: "Title is required" });
        }
        const newTask = await prisma.task.create({
          data: {
            title,
            description,
            date: date ? new Date(date) : null,
            userId,
          },
        });
        return res.status(201).json(newTask);
      } catch (error) {
        console.error("❌ Prisma Error creating task:", error);
        return res.status(500).json({ error: "Task creation failed" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}