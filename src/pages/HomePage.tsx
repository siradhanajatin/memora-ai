import React from 'react';
import { 
  Sparkles, 
  Gamepad2, 
  Image as ImageIcon, 
  CheckCircle2, 
  Activity, 
  Clock, 
  Heart, 
  Sun, 
  Moon, 
  Coffee,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { AIRecommendation, DifficultyLevel, GameSession, GameType, MemoryCard, Reminder } from '../types';
import { XAIExplanationCard } from '../components/Common/XAIExplanationCard';
import { sound } from '../services/soundService';
import { speech } from '../services/speechService';
import { ActiveTab } from '../components/Layout/Header';

interface Props {
  recommendation: AIRecommendation;
  sessions: GameSession[];
  memoryCards: MemoryCard[];
  reminders: Reminder[];
  onStartGame: (game: GameType, difficulty: DifficultyLevel) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const HomePage: React.FC<Props> = ({
  recommendation,
  sessions,
  memoryCards,
  reminders,
  onStartGame,
  setActiveTab,
}) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  const GreetingIcon = currentHour < 18 ? Sun : Moon;

  const pendingReminders = reminders.filter(r => !r.completed);
  const nextReminder = pendingReminders[0];

  const handleLaunchGame = (game: GameType, difficulty: DifficultyLevel) => {
    onStartGame(game, difficulty);
    setActiveTab('games');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      
      {/* Warm Personalized Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold text-emerald-100 mb-3 border border-white/20">
            <GreetingIcon className="w-4 h-4 text-amber-300" />
            <span>Welcome to MEMORA AI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight">
            {greeting}! Ready for a gentle memory moment?
          </h1>

          <p className="text-emerald-100 text-base sm:text-lg mt-2 font-medium leading-relaxed">
            Take a peaceful breath. Our adaptive companion has prepared personalized, gentle exercises to keep your memories bright and your spirit uplifted.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleLaunchGame(recommendation.recommendedGame, recommendation.recommendedDifficulty)}
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-extrabold text-base shadow-lg shadow-amber-900/20 transition active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Recommended Activity</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setActiveTab('reminders'); }}
              className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-base border border-white/20 transition active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span>View Today's Reminders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section: Explainable AI Recommendation Card */}
      <section aria-labelledby="xai-recommendation-heading">
        <XAIExplanationCard
          recommendation={recommendation}
          onAcceptRecommendation={(game, diff) => handleLaunchGame(game, diff)}
          onOpenGamesHub={() => { sound.playClick(); setActiveTab('games'); }}
        />
      </section>

      {/* Quick Daily Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Next Reminder Card */}
        <div 
          onClick={() => { sound.playClick(); setActiveTab('reminders'); }}
          className="bg-white rounded-3xl border-2 border-stone-200 p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                Daily Reminders
              </span>
              <Clock className="w-4 h-4 text-stone-400" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 font-serif mb-1 group-hover:text-emerald-800 transition">
              {nextReminder ? nextReminder.title : "All reminders completed today!"}
            </h3>

            {nextReminder && (
              <p className="text-sm font-semibold text-emerald-800 flex items-center gap-1.5 mt-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Scheduled for {nextReminder.time}
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>{pendingReminders.length} tasks remaining today</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Memory Cards Preview */}
        <div 
          onClick={() => { sound.playClick(); setActiveTab('memory-cards'); }}
          className="bg-white rounded-3xl border-2 border-stone-200 p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                Personal Memories
              </span>
              <ImageIcon className="w-4 h-4 text-stone-400" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 font-serif mb-1 group-hover:text-emerald-800 transition">
              {memoryCards.length} Cherished Keepsakes
            </h3>

            <p className="text-sm text-stone-600 mt-1">
              Browse friendly photos of Sarah, the summer lake cottage, and beloved pets.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>Open Memory Album</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Calming Reassurance & Caregiver Link */}
        <div 
          onClick={() => { sound.playClick(); setActiveTab('caregiver'); }}
          className="bg-white rounded-3xl border-2 border-stone-200 p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                Care Partner Portal
              </span>
              <Activity className="w-4 h-4 text-stone-400" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 font-serif mb-1 group-hover:text-emerald-800 transition">
              {sessions.length} Recorded Sessions
            </h3>

            <p className="text-sm text-stone-600 mt-1">
              View engagement trends, Recharts analytics, and export clinical summaries.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>Caregiver Analytics</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

      </div>

      {/* 3 Games Quick Explorer Row */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-emerald-700" />
            <h2 className="text-2xl font-extrabold text-stone-900 font-serif">
              Explore All Cognitive Games
            </h2>
          </div>
          <button
            onClick={() => { sound.playClick(); setActiveTab('games'); }}
            className="text-sm font-bold text-emerald-800 hover:underline"
          >
            View All Games &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Game 1: Picture Matching */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-sm hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center text-2xl mb-3">
                🌹
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-serif">Picture Matching</h3>
              <p className="text-xs text-stone-500 font-medium mb-2">Visuospatial Memory & Attention</p>
              <p className="text-xs text-stone-600 leading-relaxed">
                Flip calming nostalgic cards and find their matching companions. 4x2, 4x3, or 4x4 grid.
              </p>
            </div>
            <button
              onClick={() => handleLaunchGame('picture-matching', 'easy')}
              className="mt-4 w-full py-2.5 rounded-xl bg-stone-100 hover:bg-emerald-700 hover:text-white text-stone-800 font-bold text-sm transition"
            >
              Play Picture Matching
            </button>
          </div>

          {/* Game 2: Sequence Memory */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-sm hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center text-2xl mb-3">
                🎵
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-serif">Sequence Memory</h3>
              <p className="text-xs text-stone-500 font-medium mb-2">Working Memory & Auditory Rhythm</p>
              <p className="text-xs text-stone-600 leading-relaxed">
                Watch colored shapes light up with gentle musical tones, then repeat back the sequence.
              </p>
            </div>
            <button
              onClick={() => handleLaunchGame('sequence-memory', 'easy')}
              className="mt-4 w-full py-2.5 rounded-xl bg-stone-100 hover:bg-emerald-700 hover:text-white text-stone-800 font-bold text-sm transition"
            >
              Play Sequence Memory
            </button>
          </div>

          {/* Game 3: Object Recognition */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-sm hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center text-2xl mb-3">
                🫖
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-serif">Object Recognition</h3>
              <p className="text-xs text-stone-500 font-medium mb-2">Semantic Recall & Reminiscence</p>
              <p className="text-xs text-stone-600 leading-relaxed">
                Identify cherished everyday items like rotary phones and teapots with gentle historical stories.
              </p>
            </div>
            <button
              onClick={() => handleLaunchGame('object-recognition', 'easy')}
              className="mt-4 w-full py-2.5 rounded-xl bg-stone-100 hover:bg-emerald-700 hover:text-white text-stone-800 font-bold text-sm transition"
            >
              Play Object Recognition
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
