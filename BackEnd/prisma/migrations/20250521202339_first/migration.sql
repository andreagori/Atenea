-- CreateEnum
CREATE TYPE "LearningMethod" AS ENUM ('activeRecall', 'cornell', 'visualCard');

-- CreateEnum
CREATE TYPE "StudyMethod" AS ENUM ('pomodoro', 'simulatedTest', 'spacedRepetition');

-- CreateEnum
CREATE TYPE "Evaluation" AS ENUM ('dificil', 'masomenos', 'bien', 'facil');

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Deck" (
    "deckId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "body" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("deckId")
);

-- CreateTable
CREATE TABLE "Card" (
    "cardId" SERIAL NOT NULL,
    "deckId" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "learningMethod" "LearningMethod" NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "CardsActiveRecall" (
    "cardId" INTEGER NOT NULL,
    "questionTitle" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "CardsActiveRecall_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "CardsCornell" (
    "cardId" INTEGER NOT NULL,
    "principalNote" TEXT NOT NULL,
    "noteQuestions" TEXT NOT NULL,
    "shortNote" TEXT NOT NULL,

    CONSTRAINT "CardsCornell_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "VisualCard" (
    "cardId" INTEGER NOT NULL,
    "urlImage" VARCHAR(250) NOT NULL,

    CONSTRAINT "VisualCard_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "StudySession" (
    "sessionId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "deckId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "minDuration" INTEGER,
    "learningMethod" "LearningMethod"[],
    "studyMethod" "StudyMethod" NOT NULL,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "SessionActiveRecall" (
    "sessionId" INTEGER NOT NULL,
    "numCardsSpaced" INTEGER NOT NULL,

    CONSTRAINT "SessionActiveRecall_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "SessionPomodoro" (
    "sessionId" INTEGER NOT NULL,
    "numCards" INTEGER NOT NULL,
    "studyMinutes" INTEGER NOT NULL,
    "restMinutes" INTEGER NOT NULL,

    CONSTRAINT "SessionPomodoro_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "SessionSimulatedTest" (
    "sessionId" INTEGER NOT NULL,
    "numQuestions" INTEGER NOT NULL,
    "testDurationMin" INTEGER NOT NULL,
    "correctAnswers" INTEGER,
    "incorrectAnswers" INTEGER,

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

-- CreateTable
CREATE TABLE "SessionsResult" (
    "resultId" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionsResult_pkey" PRIMARY KEY ("resultId")
);

-- CreateTable
CREATE TABLE "UserStats" (
    "userId" INTEGER NOT NULL,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "totalStudyMin" INTEGER NOT NULL DEFAULT 0,
    "mostUsedLearningM" "LearningMethod",
    "mostUsedStudyM" "StudyMethod",

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Exam" (
    "examId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "examScore" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("examId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "SessionsResult_sessionId_key" ON "SessionsResult"("sessionId");

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("deckId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardsActiveRecall" ADD CONSTRAINT "CardsActiveRecall_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("cardId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardsCornell" ADD CONSTRAINT "CardsCornell_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("cardId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualCard" ADD CONSTRAINT "VisualCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("cardId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("deckId") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "SessionsResult" ADD CONSTRAINT "SessionsResult_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudySession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
