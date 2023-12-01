-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "task" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "tries" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
