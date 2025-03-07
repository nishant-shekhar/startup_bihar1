-- DropForeignKey
ALTER TABLE `CoWorkingApplication` DROP FOREIGN KEY `CoWorkingApplication_userId_fkey`;

-- DropIndex
DROP INDEX `CoWorkingApplication_userId_idx` ON `CoWorkingApplication`;
