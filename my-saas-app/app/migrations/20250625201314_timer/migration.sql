-- CreateTable
CREATE TABLE "speed_scores" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL,
    "clicksPerSecond" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "speed_scores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "speed_scores" ADD CONSTRAINT "speed_scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
