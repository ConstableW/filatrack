/*
  Warnings:

  - You are about to drop the column `userId` on the `FilamentLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FilamentLog" DROP CONSTRAINT "FilamentLog_userId_fkey";

-- AlterTable
ALTER TABLE "FilamentLog" DROP COLUMN "userId";
