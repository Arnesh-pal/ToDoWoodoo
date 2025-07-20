import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../src/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userId = session.user.id;
  const { id: taskId } = req.query; // Rename for clarity

  switch (req.method) {
    case "GET":
      try {
        // This query implicitly checks for ownership
        const task = await prisma.task.findFirst({
          where: { id: taskId, userId },
        });
        if (!task) return res.status(404).json({ error: "Task not found or you do not have permission" });
        return res.status(200).json(task);
      } catch (error) {
        return res.status(500).json({ error: "Failed to fetch task" });
      }

    case "PUT":
      try {
        const { title, description, completed, date } = req.body;

        // This atomic operation finds a task by its ID AND the user's ID before updating.
        // If the task doesn't belong to the user, Prisma won't find it, and no update will happen.
        const { count } = await prisma.task.updateMany({
          where: { id: taskId, userId },
          data: {
            title,
            description,
            completed,
            date: date ? new Date(date) : null,
          },
        });

        if (count === 0) {
          return res.status(404).json({ error: "Task not found or you do not have permission to update" });
        }

        // Fetch the updated task to return it
        const updatedTask = await prisma.task.findUnique({ where: { id: taskId } });
        return res.status(200).json(updatedTask);

      } catch (error) {
        console.error("❌ Prisma Error updating task:", error);
        return res.status(500).json({ error: "Task update failed" });
      }

    case "DELETE":
      try {
        // This atomic operation finds a task by its ID AND the user's ID before deleting.
        const { count } = await prisma.task.deleteMany({
          where: { id: taskId, userId },
        });

        if (count === 0) {
          return res.status(404).json({ error: "Task not found or you do not have permission to delete" });
        }

        return res.status(200).json({ message: "Task deleted successfully" });
      } catch (error) {
        console.error("❌ Prisma Error deleting task:", error);
        return res.status(500).json({ error: "Task deletion failed" });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}