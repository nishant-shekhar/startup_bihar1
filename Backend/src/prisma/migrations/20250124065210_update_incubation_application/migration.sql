/*
  Warnings:

  - You are about to drop the column `incubationCenter` on the `IncubationApplication` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `IncubationApplication` table. All the data in the column will be lost.
  - Added the required column `preference1` to the `IncubationApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preference2` to the `IncubationApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preference3` to the `IncubationApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `IncubationApplication` DROP COLUMN `incubationCenter`,
    DROP COLUMN `status`,
    ADD COLUMN `assignCenter` VARCHAR(191) NULL,
    ADD COLUMN `preference1` VARCHAR(191) NOT NULL,
    ADD COLUMN `preference2` VARCHAR(191) NOT NULL,
    ADD COLUMN `preference3` VARCHAR(191) NOT NULL;
