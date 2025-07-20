/*
  Warnings:

  - You are about to drop the column `user_id` on the `Note` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_user_id_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
