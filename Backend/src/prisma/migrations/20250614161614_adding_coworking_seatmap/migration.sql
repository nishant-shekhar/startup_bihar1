-- CreateTable
CREATE TABLE `CoWorkingSeatMap` (
    `_id` VARCHAR(191) NOT NULL,
    `center` VARCHAR(191) NOT NULL,
    `seatNo` VARCHAR(191) NOT NULL,
    `seatName` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `seatType` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
