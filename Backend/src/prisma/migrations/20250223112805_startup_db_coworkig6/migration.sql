-- CreateIndex
CREATE INDEX `CoWorkingApplication_userId_idx` ON `CoWorkingApplication`(`userId`);

-- AddForeignKey
ALTER TABLE `CoWorkingApplication` ADD CONSTRAINT `CoWorkingApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
