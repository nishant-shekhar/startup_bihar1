-- AlterTable
ALTER TABLE `CoWorkingApplication` ADD COLUMN `seatAddress` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `dpiitCert` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `QReport_userId_fkey` ON `QReport`(`userId`);

-- AddForeignKey
ALTER TABLE `QReport` ADD CONSTRAINT `QReport_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
