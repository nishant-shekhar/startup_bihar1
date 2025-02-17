-- AlterTable
ALTER TABLE `QReport` MODIFY `workOrders` VARCHAR(191) NOT NULL,
    MODIFY `customersAcquired` VARCHAR(191) NOT NULL,
    MODIFY `fullTimeFemale` VARCHAR(191) NOT NULL,
    MODIFY `fullTimeMale` VARCHAR(191) NOT NULL,
    MODIFY `partTimeFemale` VARCHAR(191) NOT NULL,
    MODIFY `partTimeMale` VARCHAR(191) NOT NULL;
