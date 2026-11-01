import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Sliders, 
  Gamepad2,
  Brain,
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { AIRecommendation, DifficultyLevel, GameType } from '../../types';
import { sound } from '../../services/soundService';
import { speech } from '../../services/speechService';

interface Props {
  recommendation: AIRecommendation;
  onAcceptRecommendation: (game: GameType, difficulty: DifficultyLevel) => void;
  onOpenGamesHub: () => void;
}

export const XAIExplanationCard: React.FC<Props> = ({
  recommendation,
  onAcceptRecommendation,
  onOpenGamesHub,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(recommendation.recommendedDifficulty);
  const [showClinicalInsights, setShowClinicalInsights] = useState(false);
  const [showOverrideMenu, setShowOverrideMenu] = useState(false);

  const handleSpeak = () => {
    sound.playClick();
    const narration = `Here is your personalized recommendation: We suggest ${recommendation.recommendedGameName} on ${selectedDifficulty} difficulty. ${recommendation.rationale}`;
    speech.speak(narration);
  };

  const handleDifficultyChange = (diff: DifficultyLevel) => {
    sound.playClick();
    setSelectedDifficulty(diff);
  };

  const handleLaunch = () => {
    sound.playClick();
    onAcceptRecommendation(recommendation.recommendedGame, selectedDifficulty);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-200/80 shadow-xl p-5 sm:p-7 relative overflow-hidden transition-all">
      {/* Decorative calm background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />

      {/* Header bar: AI badge, Confidence, Voice Read */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Brain className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Explainable Adaptive AI
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {recommendation.confidenceScore}% Model Confidence
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif">
              Next Suggested Activity
            </h3>
          </div>
        </div>

        <button
          onClick={handleSpeak}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200 text-sm font-semibold transition"
          title="Read recommendation aloud"
          aria-label="Read recommendation aloud"
        >
          <Volume2 className="w-4 h-4 text-emerald-600" />
          <span>Read to Me</span>
        </button>
      </div>

      {/* Break suggestion if fatigue flagged */}
      {recommendation.recommendedBreak && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Coffee className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-900">
            <p className="font-bold">Gentle Pause Recommended</p>
            <p className="mt-0.5">
              You've exercised your memory well today! Consider drinking a fresh glass of water or taking a peaceful 5-minute rest before continuing.
            </p>
          </div>
        </div>
      )}

      {/* Main Recommendation Highlight Box */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-2xl p-5 border border-emerald-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Recommended Game
          </span>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif">
            {recommendation.recommendedGameName}
          </h4>
          <p className="text-stone-700 text-sm sm:text-base mt-2 font-medium leading-relaxed max-w-2xl">
            {recommendation.rationale}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Target Difficulty
          </span>
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200 shadow-sm">
            {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => {
              const active = selectedDifficulty === level;
              return (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold capitalize transition ${
                    active
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* EXPLAINABLE AI (XAI): "Why this recommendation?" Feature Importance Breakdown */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h5 className="text-base sm:text-lg font-bold text-stone-900">
              Why this recommendation? (Explainable AI Logic)
            </h5>
          </div>
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">
            Transparent Heuristics & Weighted Factors
          </span>
        </div>

        {/* Feature Factor Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendation.factors.map((factor, index) => {
            return (
              <div 
                key={index}
                className="bg-stone-50 border border-stone-200/90 rounded-2xl p-3.5 flex flex-col justify-between hover:bg-stone-100/60 transition"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-sm text-stone-800 flex items-center gap-1.5">
                    {factor.direction === 'up' && <ArrowUpRight className="w-4 h-4 text-emerald-600 stroke-[2.5]" />}
                    {factor.direction === 'down' && <ArrowDownRight className="w-4 h-4 text-rose-500 stroke-[2.5]" />}
                    {factor.direction === 'steady' && <Minus className="w-4 h-4 text-amber-500 stroke-[2.5]" />}
                    {factor.factor}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700">
                    {factor.metricValue}
                  </span>
                </div>

                <p className="text-xs text-stone-600 mb-2 leading-relaxed">
                  {factor.description}
                </p>

                {/* Weight meter bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-500 font-medium mb-1">
                    <span>Feature Influence</span>
                    <span>{factor.weight}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        factor.direction === 'up' ? 'bg-emerald-600' :
                        factor.direction === 'down' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${factor.weight}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Caregiver Clinical Insight Accordion */}
      <div className="border border-stone-200 rounded-2xl p-3 bg-stone-50/50 mb-6">
        <button
          onClick={() => setShowClinicalInsights(!showClinicalInsights)}
          className="w-full flex items-center justify-between text-left font-semibold text-sm text-stone-700 hover:text-stone-900"
        >
          <span className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-700" />
            <span>Caregiver & Clinical Rationale Breakdown</span>
          </span>
          {showClinicalInsights ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showClinicalInsights && (
          <div className="mt-3 pt-3 border-t border-stone-200 text-xs sm:text-sm text-stone-600 space-y-2 leading-relaxed">
            <p>
              <strong className="text-stone-800">Adaptive Decision Model:</strong> {recommendation.clinicalRationale}
            </p>
            <p className="text-stone-500 italic">
              Confidence score is calibrated against session frequency, hint variance, and self-efficacy stability.
            </p>
          </div>
        )}
      </div>

      {/* Interactive Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={handleLaunch}
          className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-800/30 transition focus:outline-none focus:ring-4 focus:ring-emerald-400 active:scale-95"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Play {recommendation.recommendedGameName}</span>
        </button>

        <button
          onClick={onOpenGamesHub}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-base flex items-center justify-center gap-2 border border-stone-200 transition focus:outline-none focus:ring-4 focus:ring-stone-300 active:scale-95"
        >
          <Gamepad2 className="w-5 h-5 text-emerald-700" />
          <span>Pick a Different Game</span>
        </button>
      </div>
    </div>
  );
};
