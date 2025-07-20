/*
  Warnings:

  - You are about to drop the column `text` on the `Note` table. All the data in the column will be lost.
  - Added the required column `content` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "text",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "color" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
