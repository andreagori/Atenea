-- CreateEnum
CREATE TYPE "LearningMethod" AS ENUM ('activeRecall', 'cornell', 'visualCard');

-- CreateEnum
CREATE TYPE "StudyMethod" AS ENUM ('pomodoro', 'simulatedTest');

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
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "minDuration" INTEGER,
    "learningMethod" "LearningMethod" NOT NULL,
    "studyMethod" "StudyMethod" NOT NULL,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("sessionId")
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
ALTER TABLE "SessionsResult" ADD CONSTRAINT "SessionsResult_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudySession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
