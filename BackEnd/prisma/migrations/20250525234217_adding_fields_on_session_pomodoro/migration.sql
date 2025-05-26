-- AlterTable
ALTER TABLE "SessionPomodoro" ADD COLUMN     "breakStartTime" TIMESTAMP(3),
ADD COLUMN     "currentCycle" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "isOnBreak" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "studyStartTime" TIMESTAMP(3),
ADD COLUMN     "totalBreakTimeMin" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalStudyTimeMin" INTEGER NOT NULL DEFAULT 0;
