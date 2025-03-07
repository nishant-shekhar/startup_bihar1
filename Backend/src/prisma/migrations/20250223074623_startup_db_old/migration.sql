-- DropForeignKey
ALTER TABLE `CoWorkingApplication` DROP FOREIGN KEY `CoWorkingApplication_userId_fkey`;

-- DropIndex
DROP INDEX `CoWorkingApplication_userId_idx` ON `CoWorkingApplication`;

-- CreateIndex
CREATE INDEX `QReport_userId_fkey` ON `QReport`(`userId`);

-- AddForeignKey
ALTER TABLE `QReport` ADD CONSTRAINT `QReport_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
