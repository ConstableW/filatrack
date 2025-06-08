/*
  Warnings:

  - You are about to drop the `FilamentUse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FilamentUse" DROP CONSTRAINT "FilamentUse_filamentId_fkey";

-- DropTable
DROP TABLE "FilamentUse";

-- CreateTable
CREATE TABLE "FilamentLog" (
    "id" TEXT NOT NULL,
    "filamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filamentUsed" INTEGER NOT NULL,
    "previousMass" INTEGER NOT NULL,
    "newMass" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FilamentLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FilamentLog" ADD CONSTRAINT "FilamentLog_filamentId_fkey" FOREIGN KEY ("filamentId") REFERENCES "Filament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilamentLog" ADD CONSTRAINT "FilamentLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
