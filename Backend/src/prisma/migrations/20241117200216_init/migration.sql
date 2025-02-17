/*
  Warnings:

  - You are about to drop the column `certName` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `logoName` on the `Document` table. All the data in the column will be lost.
  - You are about to alter the column `averageTurnover` on the `QReport` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `currentRevenue` on the `QReport` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - Added the required column `updatedAt` to the `AccelerationProgram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designation` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CoWorkingApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `IPRReimbursement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `IncubationApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MatchingLoan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PostSeedFund` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SecondTranche` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SeedFund` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AccelerationProgram` ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Admin` ADD COLUMN `contact` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `designation` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `CoWorkingApplication` ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Document` DROP COLUMN `certName`,
    DROP COLUMN `logoName`,
    ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `IPRReimbursement` ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `IncubationApplication` ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `MatchingLoan` ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `PostSeedFund` ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `QReport` ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `averageTurnover` VARCHAR(191) NOT NULL,
    MODIFY `currentRevenue` VARCHAR(191) NOT NULL,
    MODIFY `workOrders` VARCHAR(191) NOT NULL,
    MODIFY `directEmployment` VARCHAR(191) NOT NULL,
    MODIFY `indirectEmployment` VARCHAR(191) NOT NULL,
    MODIFY `maleEmployees` VARCHAR(191) NOT NULL,
    MODIFY `femaleEmployees` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SecondTranche` ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `SeedFund` ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `about` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `facebook` VARCHAR(191) NULL,
    ADD COLUMN `founder_dp` VARCHAR(191) NULL,
    ADD COLUMN `founder_name` VARCHAR(191) NULL,
    ADD COLUMN `instagram` VARCHAR(191) NULL,
    ADD COLUMN `linkedin` VARCHAR(191) NULL,
    ADD COLUMN `logo` VARCHAR(191) NULL,
    ADD COLUMN `mobile` VARCHAR(191) NULL,
    ADD COLUMN `moto` VARCHAR(191) NULL,
    ADD COLUMN `registration_year` VARCHAR(191) NULL,
    ADD COLUMN `startup_since` VARCHAR(191) NULL,
    ADD COLUMN `twitter` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `website` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `UserNotification` (
    `_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `admin_id` VARCHAR(191) NOT NULL,
    `notification` VARCHAR(191) NOT NULL,
    `related_to` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserNotification_user_id_key`(`user_id`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
