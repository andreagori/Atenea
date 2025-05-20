/*
  Warnings:

  - You are about to drop the column `numCards` on the `SessionActiveRecall` table. All the data in the column will be lost.
  - Added the required column `numCardsSpaced` to the `SessionActiveRecall` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SessionActiveRecall" DROP COLUMN "numCards",
ADD COLUMN     "numCardsSpaced" INTEGER NOT NULL;
