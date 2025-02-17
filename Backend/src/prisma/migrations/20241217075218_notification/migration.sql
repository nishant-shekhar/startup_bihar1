/*
  Warnings:

  - Added the required column `admin_role` to the `UserNotification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserNotification` ADD COLUMN `admin_role` VARCHAR(191) NOT NULL;
