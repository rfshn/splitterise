-- CreateTable
CREATE TABLE `Bill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalBill` INTEGER NOT NULL,
    `pplInBill` JSON NOT NULL,
    `splitType` ENUM('equally', 'unequally', 'percentage') NOT NULL DEFAULT 'equally',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
