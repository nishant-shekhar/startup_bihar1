/*
  Warnings:

  - You are about to alter the column `fundAmount` on the `QReport` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `totalWorkOrderAmount` on the `QReport` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `QReport` MODIFY `fundAmount` VARCHAR(191) NOT NULL,
    MODIFY `fundsTaken` VARCHAR(191) NOT NULL,
    MODIFY `iprReceived` VARCHAR(191) NOT NULL,
    MODIFY `totalWorkOrderAmount` VARCHAR(191) NULL,
    MODIFY `unitPhotos` VARCHAR(191) NULL;
