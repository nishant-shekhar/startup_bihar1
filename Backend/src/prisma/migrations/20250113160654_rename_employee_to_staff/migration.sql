/*
  Warnings:

  - You are about to drop the column `startupId` on the `Staff` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Staff` DROP FOREIGN KEY `Staff_startupId_fkey`;

-- AlterTable
ALTER TABLE `Staff` DROP COLUMN `startupId`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;
