/*
  Warnings:

  - The values [activeRecall] on the enum `StudyMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StudyMethod_new" AS ENUM ('pomodoro', 'simulatedTest', 'spacedRepetition');
ALTER TABLE "StudySession" ALTER COLUMN "studyMethod" TYPE "StudyMethod_new" USING ("studyMethod"::text::"StudyMethod_new");
ALTER TABLE "UserStats" ALTER COLUMN "mostUsedStudyM" TYPE "StudyMethod_new" USING ("mostUsedStudyM"::text::"StudyMethod_new");
ALTER TYPE "StudyMethod" RENAME TO "StudyMethod_old";
ALTER TYPE "StudyMethod_new" RENAME TO "StudyMethod";
DROP TYPE "StudyMethod_old";
COMMIT;
