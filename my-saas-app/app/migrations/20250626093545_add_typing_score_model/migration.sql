-- CreateTable
CREATE TABLE "typing_scores" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "characters" INTEGER NOT NULL,
    "charactersPerSecond" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "typing_scores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "typing_scores" ADD CONSTRAINT "typing_scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
