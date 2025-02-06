/*
  Warnings:

  - You are about to drop the column `averageTurnover` on the `QReport` table. All the data in the column will be lost.
  - You are about to drop the column `currentStage` on the `QReport` table. All the data in the column will be lost.
  - You are about to drop the column `directEmployment` on the `QReport` table. All the data in the column will be lost.
  - You are about to drop the column `femaleEmployees` on the `QReport` table. All the data in the column will be lost.
  - You are about to drop the column `fundRaised` on the `QReport` table. All the data in the column will be lost.
  - You are about to drop the column `indirectEmployment` on the `QReport` table. All the data in the column will be lost.
  - You are about to drop the column `maleEmployees` on the `QReport` table. All the data in the column will be lost.
  - You are about to drop the column `nextQuarterGoals` on the `QReport` table. All the data in the column will be lost.
  - You are about to drop the column `partnerships` on the `QReport` table. All the data in the column will be lost.
  - You are about to alter the column `workOrders` on the `QReport` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `aboutStartup` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auditedReport` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customersAcquired` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullTimeFemale` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullTimeMale` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fundAmount` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fundsRaised` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fundsTaken` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incubationBenefits` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iprReceived` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partTimeFemale` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partTimeMale` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pitchdeck` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registeredDistrict` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sector` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stage` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCoFounders` to the `QReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWorkOrderAmount` to the `QReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `QReport` DROP FOREIGN KEY `QReport_userId_fkey`;

-- DropIndex
DROP INDEX `QReport_userId_key` ON `QReport`;

-- AlterTable
ALTER TABLE `QReport` DROP COLUMN `averageTurnover`,
    DROP COLUMN `currentStage`,
    DROP COLUMN `directEmployment`,
    DROP COLUMN `femaleEmployees`,
    DROP COLUMN `fundRaised`,
    DROP COLUMN `indirectEmployment`,
    DROP COLUMN `maleEmployees`,
    DROP COLUMN `nextQuarterGoals`,
    DROP COLUMN `partnerships`,
    ADD COLUMN `aboutStartup` VARCHAR(191) NOT NULL,
    ADD COLUMN `auditedReport` VARCHAR(191) NOT NULL,
    ADD COLUMN `benefitsDetails` VARCHAR(191) NULL,
    ADD COLUMN `customersAcquired` INTEGER NOT NULL,
    ADD COLUMN `fullTimeFemale` INTEGER NOT NULL,
    ADD COLUMN `fullTimeMale` INTEGER NOT NULL,
    ADD COLUMN `fundAmount` DOUBLE NOT NULL,
    ADD COLUMN `fundsDetails` VARCHAR(191) NULL,
    ADD COLUMN `fundsRaised` BOOLEAN NOT NULL,
    ADD COLUMN `fundsTaken` JSON NOT NULL,
    ADD COLUMN `incubationBenefits` VARCHAR(191) NOT NULL,
    ADD COLUMN `iprReceived` JSON NOT NULL,
    ADD COLUMN `otherAchievements` VARCHAR(191) NULL,
    ADD COLUMN `partTimeFemale` INTEGER NOT NULL,
    ADD COLUMN `partTimeMale` INTEGER NOT NULL,
    ADD COLUMN `pitchdeck` VARCHAR(191) NOT NULL,
    ADD COLUMN `registeredBlock` VARCHAR(191) NULL,
    ADD COLUMN `registeredDistrict` VARCHAR(191) NOT NULL,
    ADD COLUMN `sector` VARCHAR(191) NOT NULL,
    ADD COLUMN `stage` VARCHAR(191) NOT NULL,
    ADD COLUMN `totalCoFounders` VARCHAR(191) NOT NULL,
    ADD COLUMN `totalWorkOrderAmount` DOUBLE NOT NULL,
    ADD COLUMN `unitPhotos` JSON NULL,
    MODIFY `workOrders` INTEGER NOT NULL;
