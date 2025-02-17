-- AlterTable
ALTER TABLE `User` ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `coverPic` VARCHAR(191) NULL,
    ADD COLUMN `employeeCount` INTEGER NULL,
    ADD COLUMN `projects` INTEGER NULL,
    ADD COLUMN `revenueLY` INTEGER NULL,
    ADD COLUMN `status` VARCHAR(191) NULL,
    ADD COLUMN `workOrders` INTEGER NULL;

-- AlterTable
ALTER TABLE `UserNotification` ADD COLUMN `docLink` VARCHAR(191) NULL;
