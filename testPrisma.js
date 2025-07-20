import prisma from "./src/lib/prisma.js"; // Correct path for your project

async function testConnection() {
  try {
    const tasks = await prisma.task.findMany();
    console.log("✅ Successfully fetched tasks:", tasks);
  } catch (error) {
    console.error("❌ Prisma connection error:", error);
  } finally {
    await prisma.$disconnect(); // Close the Prisma connection
  }
}

testConnection();
