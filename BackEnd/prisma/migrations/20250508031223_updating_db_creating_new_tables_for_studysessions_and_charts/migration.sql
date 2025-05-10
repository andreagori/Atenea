/*
  Warnings:

  - Added the required column `title` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Evaluation" AS ENUM ('dificil', 'masomenos', 'bien', 'facil');

-- AlterEnum
ALTER TYPE "LearningMethod" ADD VALUE 'all';

-- AlterEnum
ALTER TYPE "StudyMethod" ADD VALUE 'activeRecall';

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "title" VARCHAR(100) NOT NULL;

-- CreateTable
CREATE TABLE "SessionActiveRecall" (
    "sessionId" INTEGER NOT NULL,
    "numCards" INTEGER NOT NULL,
    "learningMethodFilter" "LearningMethod"[],

    CONSTRAINT "SessionActiveRecall_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "SessionPomodoro" (
    "sessionId" INTEGER NOT NULL,
    "numCards" INTEGER NOT NULL,
    "studyMinutes" INTEGER NOT NULL,
    "restMinutes" INTEGER NOT NULL,
    "learningMethodFilter" "LearningMethod"[],

    CONSTRAINT "SessionPomodoro_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "SessionSimulatedTest" (
    "sessionId" INTEGER NOT NULL,
    "numQuestions" INTEGER NOT NULL,
    "testDurationMin" INTEGER NOT NULL,
    "learningMethodFilter" "LearningMethod"[],
    "correctAnswers" INTEGER NOT NULL,
    "incorrectAnswers" INTEGER NOT NULL,

    CONSTRAINT "SessionSimulatedTest_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "TestQuestion" (
    "questionId" SERIAL NOT NULL,
    "testId" INTEGER NOT NULL,
    "cardId" INTEGER NOT NULL,
    "userAnswer" INTEGER,
    "isCorrect" BOOLEAN,
    "optionsOrder" INTEGER[],
    "timeSpent" INTEGER,

    CONSTRAINT "TestQuestion_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "CardReview" (
    "reviewId" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "cardId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "evaluation" "Evaluation" NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextReviewAt" TIMESTAMP(3) NOT NULL,
    "intervalDays" INTEGER NOT NULL,
    "timeSpent" INTEGER,

    CONSTRAINT "CardReview_pkey" PRIMARY KEY ("reviewId")
);

-- AddForeignKey
ALTER TABLE "SessionActiveRecall" ADD CONSTRAINT "SessionActiveRecall_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudySession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionPomodoro" ADD CONSTRAINT "SessionPomodoro_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudySession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionSimulatedTest" ADD CONSTRAINT "SessionSimulatedTest_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudySession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestion" ADD CONSTRAINT "TestQuestion_testId_fkey" FOREIGN KEY ("testId") REFERENCES "SessionSimulatedTest"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestion" ADD CONSTRAINT "TestQuestion_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("cardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestion" ADD CONSTRAINT "TestQuestion_userAnswer_fkey" FOREIGN KEY ("userAnswer") REFERENCES "Card"("cardId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardReview" ADD CONSTRAINT "CardReview_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudySession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardReview" ADD CONSTRAINT "CardReview_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("cardId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardReview" ADD CONSTRAINT "CardReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
