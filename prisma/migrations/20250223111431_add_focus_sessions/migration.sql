-- CreateTable
CREATE TABLE "FocusSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "FocusSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FocusSession" ADD CONSTRAINT "FocusSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
