import { GameSession, GameType, DifficultyLevel, AIRecommendation, FeatureFactor } from '../types';

export class XAIEngine {
  /**
   * Generates an adaptive, explainable recommendation based on the player's recent sessions.
   */
  public static generateRecommendation(sessions: GameSession[]): AIRecommendation {
    const recent = sessions.slice(0, 5); // Analyze last 5 sessions

    // Default recommendation if no sessions yet
    if (recent.length === 0) {
      return {
        recommendedGame: 'picture-matching',
        recommendedGameName: 'Picture Matching',
        recommendedDifficulty: 'easy',
        confidenceScore: 85,
        rationale: "Welcome to MEMORA AI! We'll start with an easy, gentle picture matching activity to warm up your memory.",
        clinicalRationale: "Baseline assessment initiation: engaging visuospatial recall with low cognitive load to gauge initial response.",
        factors: [
          {
            factor: 'Initial Onboarding',
            weight: 90,
            direction: 'steady',
            description: 'First-time calibration mode',
            metricValue: 'New Player'
          },
          {
            factor: 'Gentle Warmup',
            weight: 85,
            direction: 'up',
            description: 'Low cognitive friction to encourage engagement',
            metricValue: 'Gentle Pace'
          }
        ],
        recommendedBreak: false,
        generatedAt: new Date().toISOString()
      };
    }

    const lastSession = recent[0];
    const totalSessions = recent.length;

    // Metrics calculations
    const avgAccuracy = Math.round(recent.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions);
    const avgHints = parseFloat((recent.reduce((sum, s) => sum + s.hintsUsed, 0) / totalSessions).toFixed(1));
    const avgDuration = Math.round(recent.reduce((sum, s) => sum + s.durationSeconds, 0) / totalSessions);

    const tooEasyCount = recent.filter(s => s.feedback === 'Too Easy').length;
    const comfortableCount = recent.filter(s => s.feedback === 'Comfortable').length;
    const tooDifficultCount = recent.filter(s => s.feedback === 'Too Difficult').length;
    const breakCount = recent.filter(s => s.feedback === 'I Want a Break').length;

    // 1. Fatigue / Break Check
    const needsBreak = lastSession.feedback === 'I Want a Break' || (recent.length >= 4 && avgDuration > 75 && avgHints >= 2);

    // 2. Difficulty Decision Logic
    let recommendedDifficulty: DifficultyLevel = lastSession.difficulty;
    let difficultyReason = '';

    if (lastSession.feedback === 'Too Difficult' || lastSession.accuracy < 70 || (lastSession.hintsUsed >= 2 && lastSession.durationSeconds > 80)) {
      if (lastSession.difficulty === 'hard') {
        recommendedDifficulty = 'medium';
        difficultyReason = 'Scaled down to Medium difficulty to keep activities pleasant and stress-free.';
      } else {
        recommendedDifficulty = 'easy';
        difficultyReason = 'Maintained on Easy difficulty to foster confidence and gentle enjoyment.';
      }
    } else if (
      (lastSession.feedback === 'Too Easy' || tooEasyCount >= 2) &&
      avgAccuracy >= 92 &&
      avgHints <= 0.5
    ) {
      if (lastSession.difficulty === 'easy') {
        recommendedDifficulty = 'medium';
        difficultyReason = 'Promoted to Medium because you mastered Easy activities with top accuracy and zero hints!';
      } else if (lastSession.difficulty === 'medium' && avgAccuracy >= 95) {
        recommendedDifficulty = 'hard';
        difficultyReason = 'Promoted to Hard as you showed flawless recall and reported the activity felt very easy.';
      } else {
        recommendedDifficulty = 'medium';
        difficultyReason = 'Maintained on a stimulating Medium difficulty level.';
      }
    } else {
      // Comfortable zone
      recommendedDifficulty = lastSession.difficulty;
      difficultyReason = `Preserved your current ${recommendedDifficulty.toUpperCase()} level because you felt comfortable and steady.`;
    }

    // 3. Game Selection (Cognitive Domain Balancing)
    // Picture Matching = Visuospatial; Sequence Memory = Working Memory; Object Recognition = Semantic Recall
    const gamePlayCounts: Record<GameType, number> = {
      'picture-matching': 0,
      'sequence-memory': 0,
      'object-recognition': 0
    };
    recent.forEach(s => {
      gamePlayCounts[s.gameType]++;
    });

    let recommendedGame: GameType = 'object-recognition';
    let gameRationale = '';

    // If last game was too difficult, offer gentle semantic recall (Object Recognition)
    if (lastSession.feedback === 'Too Difficult' && lastSession.gameType !== 'object-recognition') {
      recommendedGame = 'object-recognition';
      gameRationale = 'Switching to Object Recognition: familiar nostalgic items provide a calming, reassuring recall experience.';
    } else {
      // Pick the least recently or least frequently played game in recent sessions
      const games: GameType[] = ['picture-matching', 'sequence-memory', 'object-recognition'];
      games.sort((a, b) => gamePlayCounts[a] - gamePlayCounts[b]);
      recommendedGame = games[0];

      if (recommendedGame === 'picture-matching') {
        gameRationale = 'Picture Matching stimulates visual spatial recall and pattern recognition.';
      } else if (recommendedGame === 'sequence-memory') {
        gameRationale = 'Sequence Memory activates attentive short-term working memory through musical rhythms.';
      } else {
        gameRationale = 'Object Recognition engages semantic memory and heartwarming reminiscence.';
      }
    }

    // 4. Feature Importance Factors for Explainability (XAI)
    const factors: FeatureFactor[] = [
      {
        factor: 'Recent Recall Accuracy',
        weight: Math.min(100, Math.round(avgAccuracy * 0.95)),
        direction: avgAccuracy >= 85 ? 'up' : avgAccuracy >= 70 ? 'steady' : 'down',
        description: `${avgAccuracy}% average score across recent ${totalSessions} sessions`,
        metricValue: `${avgAccuracy}%`
      },
      {
        factor: 'Independence & Hint Reliance',
        weight: Math.max(20, Math.round(100 - avgHints * 30)),
        direction: avgHints <= 0.5 ? 'up' : avgHints <= 1.5 ? 'steady' : 'down',
        description: avgHints === 0 ? 'Zero hints needed – high autonomous recall' : `Average ${avgHints} hints per session`,
        metricValue: `${avgHints} hints/game`
      },
      {
        factor: 'User Self-Reported Comfort',
        weight: 90,
        direction: comfortableCount + tooEasyCount >= tooDifficultCount ? 'up' : 'down',
        description: `Most recent feedback was "${lastSession.feedback}"`,
        metricValue: lastSession.feedback
      },
      {
        factor: 'Cognitive Domain Balancing',
        weight: 75,
        direction: 'steady',
        description: `Balanced rotation across visuospatial, working, and semantic memory`,
        metricValue: `${gamePlayCounts[recommendedGame]} recent plays`
      },
      {
        factor: 'Cognitive Pacing & Rhythm',
        weight: 65,
        direction: avgDuration < 50 ? 'up' : 'steady',
        description: `Average completion time is ${avgDuration}s (calm and deliberate)`,
        metricValue: `${avgDuration}s avg`
      }
    ];

    // Compute Confidence Score based on data sufficiency and consistency
    let confidence = 80;
    if (totalSessions >= 5) confidence += 10;
    if (comfortableCount >= 3) confidence += 5;
    confidence = Math.min(96, Math.max(65, confidence));

    const gameNames: Record<GameType, string> = {
      'picture-matching': 'Picture Matching',
      'sequence-memory': 'Sequence Memory',
      'object-recognition': 'Object Recognition'
    };

    const friendlyRationale = `${difficultyReason} ${gameRationale}`;
    const clinicalRationale = `Algorithmic analysis of n=${totalSessions} sessions indicates ${avgAccuracy}% accuracy with μ=${avgHints} hints. Domain balancing shifted target to ${gameNames[recommendedGame]} (${recommendedDifficulty}) to mitigate domain fatigue and maintain self-efficacy.`;

    return {
      recommendedGame,
      recommendedGameName: gameNames[recommendedGame],
      recommendedDifficulty,
      confidenceScore: confidence,
      rationale: friendlyRationale,
      clinicalRationale,
      factors,
      recommendedBreak: needsBreak,
      hydrationPrompt: needsBreak || totalSessions >= 3,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Helper to calculate overall cognitive stability index (0 to 100)
   */
  public static calculateCognitiveStability(sessions: GameSession[]): number {
    if (!sessions || sessions.length === 0) return 80;
    const recent = sessions.slice(0, 10);
    const avgAccuracy = recent.reduce((sum, s) => sum + s.accuracy, 0) / recent.length;
    const avgHints = recent.reduce((sum, s) => sum + s.hintsUsed, 0) / recent.length;
    const comfortableRate = recent.filter(s => s.feedback === 'Comfortable' || s.feedback === 'Too Easy').length / recent.length;

    // Weighted composite index
    const stability = (avgAccuracy * 0.5) + (Math.max(0, 100 - avgHints * 25) * 0.25) + (comfortableRate * 100 * 0.25);
    return Math.round(Math.min(98, Math.max(50, stability)));
  }
}
