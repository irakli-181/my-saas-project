import { type TypingScore } from 'wasp/entities';
import { HttpError } from 'wasp/server';

type CreateTypingScorePayload = {
  duration: number;
  words: number;
  wordsPerMinute: number;
};

export const createTypingScore = async (
  { duration, words, wordsPerMinute }: CreateTypingScorePayload,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // Validate input
  if (duration <= 0 || words < 0 || wordsPerMinute < 0) {
    throw new HttpError(400, 'Invalid typing score data');
  }

  // First, get the user's current typing scores count
  const existingScoresCount = await context.entities.TypingScore.count({
    where: { userId: context.user.id },
  });

  // If user already has 10 scores, delete the oldest one
  if (existingScoresCount >= 10) {
    const oldestScore = await context.entities.TypingScore.findFirst({
      where: { userId: context.user.id },
      orderBy: { createdAt: 'asc' },
    });

    if (oldestScore) {
      await context.entities.TypingScore.delete({
        where: { id: oldestScore.id },
      });
    }
  }

  // Create the new typing score
  return context.entities.TypingScore.create({
    data: {
      duration,
      words,
      wordsPerMinute,
      user: { connect: { id: context.user.id } },
    },
  });
};

export const getTypingScores = async (_args: any, context: any) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.TypingScore.findMany({
    where: { userId: context.user.id },
    orderBy: { createdAt: 'desc' },
  });
}; 