/*
  Warnings:

  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_startupId_fkey`;

-- DropTable
DROP TABLE `Employee`;

-- CreateTable
CREATE TABLE `Staff` (
    `_id` VARCHAR(191) NOT NULL,
    `startupId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `dp` VARCHAR(191) NULL,
    `qualification` VARCHAR(191) NOT NULL,
    `designation` VARCHAR(191) NOT NULL,
    `display` BOOLEAN NOT NULL DEFAULT true,
    `rank` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Staff` ADD CONSTRAINT `Staff_startupId_fkey` FOREIGN KEY (`startupId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
