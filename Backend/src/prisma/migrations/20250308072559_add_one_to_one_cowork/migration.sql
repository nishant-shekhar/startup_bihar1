-- CreateTable
CREATE TABLE `CoWorking` (
    `_id` VARCHAR(191) NOT NULL,
    `coworkingCenter` VARCHAR(191) NOT NULL,
    `seatNo` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `seatAddress` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `documentStatus` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CoWorking_userId_key`(`userId`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CoWorking` ADD CONSTRAINT `CoWorking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
