/*
  Warnings:

  - The values [all] on the enum `LearningMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LearningMethod_new" AS ENUM ('activeRecall', 'cornell', 'visualCard');
ALTER TABLE "Card" ALTER COLUMN "learningMethod" TYPE "LearningMethod_new" USING ("learningMethod"::text::"LearningMethod_new");
ALTER TABLE "StudySession" ALTER COLUMN "learningMethod" TYPE "LearningMethod_new" USING ("learningMethod"::text::"LearningMethod_new");
ALTER TABLE "SessionActiveRecall" ALTER COLUMN "learningMethodFilter" TYPE "LearningMethod_new"[] USING ("learningMethodFilter"::text::"LearningMethod_new"[]);
ALTER TABLE "SessionPomodoro" ALTER COLUMN "learningMethodFilter" TYPE "LearningMethod_new"[] USING ("learningMethodFilter"::text::"LearningMethod_new"[]);
ALTER TABLE "SessionSimulatedTest" ALTER COLUMN "learningMethodFilter" TYPE "LearningMethod_new"[] USING ("learningMethodFilter"::text::"LearningMethod_new"[]);
ALTER TABLE "UserStats" ALTER COLUMN "mostUsedLearningM" TYPE "LearningMethod_new" USING ("mostUsedLearningM"::text::"LearningMethod_new");
ALTER TYPE "LearningMethod" RENAME TO "LearningMethod_old";
ALTER TYPE "LearningMethod_new" RENAME TO "LearningMethod";
DROP TYPE "LearningMethod_old";
COMMIT;
