import React, { useState } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  HelpCircle, 
  Play, 
  Layers, 
  ArrowLeft, 
  Volume2, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';
import { AIRecommendation, DifficultyLevel, GameSession, GameType } from '../types';
import { PictureMatchingGame } from '../components/Games/PictureMatchingGame';
import { SequenceMemoryGame } from '../components/Games/SequenceMemoryGame';
import { ObjectRecognitionGame } from '../components/Games/ObjectRecognitionGame';
import { sound } from '../services/soundService';
import { speech } from '../services/speechService';

interface Props {
  activeGame: GameType | null;
  activeDifficulty: DifficultyLevel;
  recommendation: AIRecommendation;
  onStartGame: (game: GameType, difficulty: DifficultyLevel) => void;
  onExitGame: () => void;
  onCompleteGame: (summary: Omit<GameSession, 'id' | 'timestamp' | 'feedback'>) => void;
}

export const GamesHubPage: React.FC<Props> = ({
  activeGame,
  activeDifficulty,
  recommendation,
  onStartGame,
  onExitGame,
  onCompleteGame,
}) => {
  const [selectedDifficulties, setSelectedDifficulties] = useState<Record<GameType, DifficultyLevel>>({
    'picture-matching': 'easy',
    'sequence-memory': 'easy',
    'object-recognition': 'easy',
  });

  const handleDifficultyChange = (game: GameType, diff: DifficultyLevel) => {
    sound.playClick();
    setSelectedDifficulties(prev => ({ ...prev, [game]: diff }));
  };

  // If a game is currently active, render the playable interactive game engine!
  if (activeGame === 'picture-matching') {
    return (
      <PictureMatchingGame
        difficulty={activeDifficulty}
        onExit={onExitGame}
        onComplete={onCompleteGame}
      />
    );
  }

  if (activeGame === 'sequence-memory') {
    return (
      <SequenceMemoryGame
        difficulty={activeDifficulty}
        onExit={onExitGame}
        onComplete={onCompleteGame}
      />
    );
  }

  if (activeGame === 'object-recognition') {
    return (
      <ObjectRecognitionGame
        difficulty={activeDifficulty}
        onExit={onExitGame}
        onComplete={onCompleteGame}
      />
    );
  }

  // Games Hub Selector
  const gamesList: {
    type: GameType;
    title: string;
    domain: string;
    domainDesc: string;
    iconEmoji: string;
    description: string;
    easyDetail: string;
    mediumDetail: string;
    hardDetail: string;
    themeColor: string;
  }[] = [
    {
      type: 'picture-matching',
      title: 'Picture Matching',
      domain: 'Visuospatial Memory',
      domainDesc: 'Stimulates pattern recognition and spatial recall in occipital & parietal cortex.',
      iconEmoji: '🌹',
      description: 'Find matching pairs of flowers, animals, and classic objects on an accessible flip grid.',
      easyDetail: '4 pairs (8 cards, 4x2 grid)',
      mediumDetail: '6 pairs (12 cards, 4x3 grid)',
      hardDetail: '8 pairs (16 cards, 4x4 grid)',
      themeColor: 'from-rose-500/10 to-emerald-500/10 border-rose-200',
    },
    {
      type: 'sequence-memory',
      title: 'Sequence Memory',
      domain: 'Working Memory & Attention',
      domainDesc: 'Engages the dorsolateral prefrontal loop through melodic & visual rhythm tracking.',
      iconEmoji: '🎵',
      description: 'Watch illuminated shapes play warm harmonic tones, then repeat back the pattern.',
      easyDetail: '3 musical steps sequence',
      mediumDetail: '4 musical steps sequence',
      hardDetail: '5 musical steps sequence',
      themeColor: 'from-sky-500/10 to-indigo-500/10 border-sky-200',
    },
    {
      type: 'object-recognition',
      title: 'Object Recognition',
      domain: 'Semantic Memory & Reminiscence',
      domainDesc: 'Activates temporal lobe semantic networks and emotional long-term reminiscence.',
      iconEmoji: '🫖',
      description: 'Identify beloved nostalgic everyday items with gentle hints and historical trivia.',
      easyDetail: '3 items with gentle clues',
      mediumDetail: '5 items with multiple choice',
      hardDetail: '7 items with subtle clues',
      themeColor: 'from-amber-500/10 to-orange-500/10 border-amber-200',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mb-1">
            Cognitive Gym
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
            Interactive Cognitive Games
          </h1>
          <p className="text-sm text-stone-500 font-medium">
            Scientifically inspired, pressure-free activities designed to exercise different memory domains.
          </p>
        </div>

        {/* Quick Launch Recommended Game Pill */}
        <button
          onClick={() => {
            sound.playClick();
            onStartGame(recommendation.recommendedGame, recommendation.recommendedDifficulty);
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-extrabold text-sm shadow-md transition active:scale-95 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Launch AI Pick: {recommendation.recommendedGameName}</span>
        </button>
      </div>

      {/* Game Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gamesList.map((game) => {
          const currentDiff = selectedDifficulties[game.type];
          const isAiChoice = recommendation.recommendedGame === game.type;

          return (
            <div
              key={game.type}
              className={`bg-white rounded-3xl border-2 p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden ${
                isAiChoice ? 'border-emerald-500 ring-2 ring-emerald-300' : 'border-stone-200'
              }`}
            >
              {isAiChoice && (
                <div className="absolute top-0 right-0 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>AI Recommended</span>
                </div>
              )}

              <div>
                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center text-3xl shadow-sm">
                    {game.iconEmoji}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                      {game.domain}
                    </span>
                    <h3 className="text-xl font-extrabold text-stone-900 font-serif">
                      {game.title}
                    </h3>
                  </div>
                </div>

                <p className="text-stone-600 text-sm font-medium mb-4 leading-relaxed">
                  {game.description}
                </p>

                {/* Cognitive Domain Note */}
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs text-stone-500 mb-5">
                  <strong className="text-stone-700">Domain Focus:</strong> {game.domainDesc}
                </div>

                {/* Difficulty Selector */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                    Select Difficulty Level:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-stone-100 p-1 rounded-xl">
                    {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => {
                      const active = currentDiff === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleDifficultyChange(game.type, level)}
                          className={`py-2 rounded-lg text-xs font-bold capitalize transition ${
                            active
                              ? 'bg-emerald-700 text-white shadow-sm'
                              : 'text-stone-600 hover:bg-stone-200/70'
                          }`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-2 italic text-center">
                    {currentDiff === 'easy' && game.easyDetail}
                    {currentDiff === 'medium' && game.mediumDetail}
                    {currentDiff === 'hard' && game.hardDetail}
                  </p>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  onStartGame(game.type, currentDiff);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-md shadow-emerald-800/20 transition active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Play {game.title}</span>
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
