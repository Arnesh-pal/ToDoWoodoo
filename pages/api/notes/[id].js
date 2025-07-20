import prisma from "../../../src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;
  const { id: noteId } = req.query; // Rename id for clarity

  switch (req.method) {
    case "DELETE":
      try {
        // This is an atomic operation. It will only delete the note if the `noteId`
        // exists AND it belongs to the currently logged-in `userId`.
        const { count } = await prisma.note.deleteMany({
          where: {
            id: noteId,
            userId: userId, // <-- This is the crucial security check
          },
        });

        // If count is 0, the note was not found or the user didn't have permission.
        if (count === 0) {
          return res.status(404).json({ error: "Note not found or you do not have permission to delete" });
        }

        return res.status(200).json({ message: "Note deleted successfully" });
      } catch (error) {
        console.error("❌ Error deleting note:", error);
        return res.status(500).json({ error: "Error deleting note" });
      }

    default:
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}