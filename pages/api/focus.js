import prisma from "../../src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;

  // POST method for creating a new focus session (remains the same)
  if (req.method === "POST") {
    const { duration } = req.body;

    if (!duration || duration < 60) {
      return res.status(400).json({ error: "Duration must be at least 60 seconds." });
    }

    try {
      const newSession = await prisma.focusSession.create({
        data: {
          duration,
          userId,
        },
      });
      return res.status(201).json(newSession);
    } catch (error) {
      console.error("Error logging focus session:", error);
      return res.status(500).json({ error: "Failed to log focus time." });
    }
  }

  // GET method for fetching aggregated graph data (now optimized)
  if (req.method === "GET") {
    try {
      // ✅ Create a date object for 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [focusData, tasksCompleted, tasksCreated] = await Promise.all([
        prisma.focusSession.groupBy({
          by: ['date'],
          // ✅ Filter for dates greater than or equal to 7 days ago
          where: { userId, date: { gte: sevenDaysAgo } },
          _sum: { duration: true },
        }),
        prisma.task.groupBy({
          by: ['createdAt'],
          // ✅ Filter for dates greater than or equal to 7 days ago
          where: { userId, completed: true, createdAt: { gte: sevenDaysAgo } },
          _count: { _all: true },
        }),
        prisma.task.groupBy({
          by: ['createdAt'],
          // ✅ Filter for dates greater than or equal to 7 days ago
          where: { userId, createdAt: { gte: sevenDaysAgo } },
          _count: { _all: true },
        }),
      ]);

      // ... The rest of the data formatting logic remains the same ...
      const formattedFocus = focusData.map(item => ({
        date: item.date.toISOString().split('T')[0],
        _sum: { duration: item._sum.duration || 0 },
      }));
      const formattedTasksCompleted = tasksCompleted.map(item => ({
        createdAt: item.createdAt.toISOString().split('T')[0],
        _count: { completed: item._count._all || 0 },
      }));
      const formattedTasksCreated = tasksCreated.map(item => ({
        createdAt: item.createdAt.toISOString().split('T')[0],
        _count: { created: item._count._all || 0 },
      }));

      return res.status(200).json({
        focusData: formattedFocus,
        tasksCompleted: formattedTasksCompleted,
        tasksCreated: formattedTasksCreated,
      });

    } catch (error) {
      console.error("Error fetching focus data:", error);
      return res.status(500).json({ error: "Failed to fetch data." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}