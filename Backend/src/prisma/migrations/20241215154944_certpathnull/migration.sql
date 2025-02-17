-- AlterTable
ALTER TABLE `Document` MODIFY `certPath` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `UserNotification` ADD COLUMN `subtitle` VARCHAR(191) NULL;
