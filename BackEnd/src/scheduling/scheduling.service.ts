import { Injectable } from '@nestjs/common';
import { Evaluation } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const SPACED_INTERVAL_DAYS = [0, 1, 2, 4, 7, 14, 21, 30];

const LEARNING_STEPS_MIN = [1, 2, 5];

export type LearningMinGap = number;
export const LEARNING_GAP: Record<Evaluation, LearningMinGap> = {
  dificil: 1,
  masomenos: 3,
  bien: 8,
  facil: 8,
};

export interface ScheduledResult {
  level: number;
  repsInLearning: number;
  facilPending: boolean;
  intervalMinutes: number;
  nextReviewAt: Date;
  graduated: boolean;
}

@Injectable()
export class SchedulingService {
  constructor(private readonly prisma: PrismaService) {}

  private daysToMinutes(d: number) {
    return d * 24 * 60;
  }

  private firstLearningStepMin() {
    return LEARNING_STEPS_MIN[0];
  }

  /** Pure function: compute the next state from prev state + rating. */
  computeNext(
    prev: {
      level: number;
      repsInLearning: number;
      facilPending: boolean;
    },
    rating: Evaluation,
  ): Omit<ScheduledResult, 'nextReviewAt'> & { intervalMinutes: number } {
    const isLearning = prev.level === 0;

    if (isLearning) {
      if (rating === 'dificil') {
        return {
          level: 0,
          repsInLearning: prev.repsInLearning + 1,
          facilPending: false,
          intervalMinutes: LEARNING_STEPS_MIN[0],
          graduated: false,
        };
      }
      if (rating === 'masomenos') {
        return {
          level: 0,
          repsInLearning: prev.repsInLearning + 1,
          facilPending: prev.facilPending,
          intervalMinutes: LEARNING_STEPS_MIN[0],
          graduated: false,
        };
      }
      if (rating === 'bien') {
        return {
          level: 0,
          repsInLearning: prev.repsInLearning + 1,
          facilPending: prev.facilPending,
          intervalMinutes:
            LEARNING_STEPS_MIN[
              Math.min(prev.repsInLearning + 1, LEARNING_STEPS_MIN.length - 1)
            ],
          graduated: false,
        };
      }
      // facil
      const canGraduate = prev.repsInLearning >= 1 || prev.facilPending;
      if (canGraduate) {
        return {
          level: 2,
          repsInLearning: 0,
          facilPending: false,
          intervalMinutes: this.daysToMinutes(SPACED_INTERVAL_DAYS[2]),
          graduated: true,
        };
      }
      return {
        level: 0,
        repsInLearning: prev.repsInLearning + 1,
        facilPending: true,
        intervalMinutes:
          LEARNING_STEPS_MIN[
            Math.min(prev.repsInLearning + 1, LEARNING_STEPS_MIN.length - 1)
          ],
        graduated: false,
      };
    }

    // Spaced phase
    if (rating === 'dificil') {
      return {
        level: 0,
        repsInLearning: 0,
        facilPending: false,
        intervalMinutes: this.firstLearningStepMin(),
        graduated: false,
      };
    }
    if (rating === 'masomenos') {
      const next = Math.max(1, prev.level - 1);
      return {
        level: next,
        repsInLearning: 0,
        facilPending: false,
        intervalMinutes: this.daysToMinutes(SPACED_INTERVAL_DAYS[next]),
        graduated: false,
      };
    }
    if (rating === 'bien') {
      const next = Math.min(SPACED_INTERVAL_DAYS.length - 1, prev.level + 1);
      return {
        level: next,
        repsInLearning: 0,
        facilPending: false,
        intervalMinutes: this.daysToMinutes(SPACED_INTERVAL_DAYS[next]),
        graduated: false,
      };
    }
    // facil
    const next = Math.min(SPACED_INTERVAL_DAYS.length - 1, prev.level + 2);
    return {
      level: next,
      repsInLearning: 0,
      facilPending: false,
      intervalMinutes: this.daysToMinutes(SPACED_INTERVAL_DAYS[next]),
      graduated: false,
    };
  }

  /** Apply a rating to a card, upserting CardMemoryState. */
  async applyRating(
    userId: number,
    cardId: number,
    rating: Evaluation,
    now = new Date(),
  ): Promise<ScheduledResult> {
    const existing = await this.prisma.cardMemoryState.findUnique({
      where: { userId_cardId: { userId, cardId } },
    });

    const prev = existing
      ? {
          level: existing.level,
          repsInLearning: existing.repsInLearning,
          facilPending: existing.facilPending,
        }
      : { level: 0, repsInLearning: 0, facilPending: false };

    const next = this.computeNext(prev, rating);
    const nextReviewAt = new Date(now.getTime() + next.intervalMinutes * 60_000);

    await this.prisma.cardMemoryState.upsert({
      where: { userId_cardId: { userId, cardId } },
      create: {
        userId,
        cardId,
        level: next.level,
        repsInLearning: next.repsInLearning,
        facilPending: next.facilPending,
        intervalMinutes: next.intervalMinutes,
        lastReviewedAt: now,
        nextReviewAt,
      },
      update: {
        level: next.level,
        repsInLearning: next.repsInLearning,
        facilPending: next.facilPending,
        intervalMinutes: next.intervalMinutes,
        lastReviewedAt: now,
        nextReviewAt,
      },
    });

    return { ...next, nextReviewAt };
  }

  /** Count due cards per deck for a user. */
  async getDueCountsPerDeck(userId: number) {
    const states = await this.prisma.cardMemoryState.findMany({
      where: {
        userId,
        OR: [{ level: 0 }, { nextReviewAt: { lte: new Date() } }],
      },
      select: { cardId: true },
    });

    if (states.length === 0) return [];

    const cardIds = states.map((s) => s.cardId);
    const cards = await this.prisma.card.findMany({
      where: { cardId: { in: cardIds } },
      select: {
        cardId: true,
        deck: { select: { deckId: true, title: true } },
      },
    });

    const byDeck = new Map<number, { deckId: number; deckTitle: string; dueCount: number }>();
    for (const c of cards) {
      const entry = byDeck.get(c.deck.deckId) ?? {
        deckId: c.deck.deckId,
        deckTitle: c.deck.title,
        dueCount: 0,
      };
      entry.dueCount += 1;
      byDeck.set(c.deck.deckId, entry);
    }
    return Array.from(byDeck.values()).sort((a, b) => b.dueCount - a.dueCount);
  }

  exposeIntervals() {
    return { learningStepsMin: LEARNING_STEPS_MIN, spacedDays: SPACED_INTERVAL_DAYS };
  }
}
