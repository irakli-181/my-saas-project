import { type User, type SpeedScore } from 'wasp/entities';
import { type CreateSpeedScore, type GetSpeedScores } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

type CreateSpeedScorePayload = {
  duration: number; // Timer duration in seconds
  clicks: number; // Total clicks made
  clicksPerSecond: number; // Calculated CPS rate
};

export const createSpeedScore: CreateSpeedScore<CreateSpeedScorePayload, SpeedScore> = async (
  { duration, clicks, clicksPerSecond },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  // Validate input
  if (duration <= 0 || clicks < 0 || clicksPerSecond < 0) {
    throw new HttpError(400, 'Invalid score data');
  }

  // Get user's existing scores to maintain limit of 10
  const existingScores = await context.entities.SpeedScore.findMany({
    where: { userId: context.user.id },
    orderBy: { createdAt: 'desc' },
  });

  // If user has 10 or more scores, delete the oldest ones
  if (existingScores.length >= 10) {
    const scoresToDelete = existingScores.slice(9); // Keep only the 9 newest
    await context.entities.SpeedScore.deleteMany({
      where: {
        id: {
          in: scoresToDelete.map((score: SpeedScore) => score.id),
        },
      },
    });
  }

  // Create the new speed score
  const newSpeedScore = await context.entities.SpeedScore.create({
    data: {
      userId: context.user.id,
      duration,
      clicks,
      clicksPerSecond,
    },
  });

  return newSpeedScore;
};

export const getSpeedScores: GetSpeedScores<void, SpeedScore[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  // Get user's speed scores, newest first, limited to 10
  const speedScores = await context.entities.SpeedScore.findMany({
    where: { userId: context.user.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return speedScores;
}; 