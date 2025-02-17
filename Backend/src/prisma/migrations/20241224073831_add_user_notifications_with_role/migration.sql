-- DropIndex
DROP INDEX `UserNotification_user_id_key` ON `UserNotification`;

-- AlterTable
ALTER TABLE `UserNotification` ADD COLUMN `isRead` BOOLEAN NOT NULL DEFAULT false;
