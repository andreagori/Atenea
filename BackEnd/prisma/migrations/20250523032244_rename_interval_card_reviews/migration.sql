/*
  Warnings:

  - You are about to drop the column `intervalDays` on the `CardReview` table. All the data in the column will be lost.
  - Added the required column `intervalMinutes` to the `CardReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CardReview" DROP COLUMN "intervalDays",
ADD COLUMN     "intervalMinutes" INTEGER NOT NULL;
