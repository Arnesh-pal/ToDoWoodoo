-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
