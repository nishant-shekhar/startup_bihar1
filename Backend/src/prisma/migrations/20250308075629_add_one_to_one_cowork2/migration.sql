-- DropForeignKey
ALTER TABLE `CoWorking` DROP FOREIGN KEY `CoWorking_userId_fkey`;

-- AddForeignKey
ALTER TABLE `CoWorking` ADD CONSTRAINT `CoWorking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
