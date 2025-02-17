/*
  Warnings:

  - Made the column `topStartup` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `topStartup` BOOLEAN NOT NULL DEFAULT false;
