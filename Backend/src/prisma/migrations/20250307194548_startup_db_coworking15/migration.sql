/*
  Warnings:

  - You are about to drop the column `seatAddress` on the `CoWorkingApplication` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `QReport` DROP FOREIGN KEY `QReport_userId_fkey`;

-- DropIndex
DROP INDEX `QReport_userId_fkey` ON `QReport`;

-- AlterTable
ALTER TABLE `CoWorkingApplication` DROP COLUMN `seatAddress`;
