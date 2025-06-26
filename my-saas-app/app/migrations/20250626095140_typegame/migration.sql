/*
  Warnings:

  - You are about to drop the column `characters` on the `typing_scores` table. All the data in the column will be lost.
  - You are about to drop the column `charactersPerSecond` on the `typing_scores` table. All the data in the column will be lost.
  - Added the required column `words` to the `typing_scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wordsPerMinute` to the `typing_scores` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add new columns with default values
ALTER TABLE "typing_scores" 
ADD COLUMN "words" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "wordsPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- Step 2: Convert existing data (approximate: 5 characters per word average)
UPDATE "typing_scores" 
SET "words" = CEIL("characters"::DOUBLE PRECISION / 5.0),
    "wordsPerMinute" = ("charactersPerSecond" * 60.0 / 5.0);

-- Step 3: Drop old columns
ALTER TABLE "typing_scores" 
DROP COLUMN "characters",
DROP COLUMN "charactersPerSecond";

-- Step 4: Remove default values from new columns (they're now required without defaults)
ALTER TABLE "typing_scores" 
ALTER COLUMN "words" DROP DEFAULT,
ALTER COLUMN "wordsPerMinute" DROP DEFAULT;
