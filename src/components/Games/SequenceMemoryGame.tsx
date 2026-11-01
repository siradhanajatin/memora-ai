import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  HelpCircle, 
  RotateCcw, 
  Volume2, 
  Play, 
  CheckCircle2, 
  Circle, 
  Star, 
  Square, 
  Heart 
} from 'lucide-react';
import { DifficultyLevel, GameSession } from '../../types';
import { sound } from '../../services/soundService';
import { speech } from '../../services/speechService';

interface PadConfig {
  id: number;
  label: string;
  icon: React.ReactNode;
  activeColor: string;
  inactiveColor: string;
  borderColor: string;
  textColor: string;
}

const PADS: PadConfig[] = [
  {
    id: 0,
    label: 'Sunbeam Star',
    icon: <Star className="w-8 h-8 fill-amber-400 text-amber-500" />,
    activeColor: 'bg-amber-300 ring-8 ring-amber-400 scale-105 shadow-xl',
    inactiveColor: 'bg-amber-50 hover:bg-amber-100',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-900',
  },
  {
    id: 1,
    label: 'Ocean Circle',
    icon: <Circle className="w-8 h-8 fill-sky-400 text-sky-500" />,
    activeColor: 'bg-sky-300 ring-8 ring-sky-400 scale-105 shadow-xl',
    inactiveColor: 'bg-sky-50 hover:bg-sky-100',
    borderColor: 'border-sky-300',
    textColor: 'text-sky-900',
  },
  {
    id: 2,
    label: 'Forest Diamond',
    icon: <Square className="w-8 h-8 fill-emerald-400 text-emerald-500 rotate-45 scale-75" />,
    activeColor: 'bg-emerald-300 ring-8 ring-emerald-400 scale-105 shadow-xl',
    inactiveColor: 'bg-emerald-50 hover:bg-emerald-100',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-900',
  },
  {
    id: 3,
    label: 'Rose Heart',
    icon: <Heart className="w-8 h-8 fill-rose-400 text-rose-500" />,
    activeColor: 'bg-rose-300 ring-8 ring-rose-400 scale-105 shadow-xl',
    inactiveColor: 'bg-rose-50 hover:bg-rose-100',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-900',
  },
];

interface Props {
  difficulty: DifficultyLevel;
  onExit: () => void;
  onComplete: (summary: Omit<GameSession, 'id' | 'timestamp' | 'feedback'>) => void;
}

export const SequenceMemoryGame: React.FC<Props> = ({
  difficulty,
  onExit,
  onComplete,
}) => {
  // Target sequence length based on difficulty:
  // Easy: 3 steps
  // Medium: 4 steps
  // Hard: 5 steps
  const targetLength = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;

  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'ready_for_player' | 'round_complete'>('idle');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate sequence
  const initGame = () => {
    const newSeq: number[] = [];
    for (let i = 0; i < targetLength; i++) {
      newSeq.push(Math.floor(Math.random() * 4));
    }
    setSequence(newSeq);
    setPlayerInput([]);
    setAttempts(0);
    setHintsUsed(0);
    setTimeTaken(0);
    setGameStatus('idle');

    speech.speak(`Sequence Memory on ${difficulty} difficulty. Watch the shapes light up in order, then repeat the sequence.`);
  };

  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (gameStatus === 'ready_for_player' || gameStatus === 'playing') {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setTimeTaken(prev => prev + 1);
        }, 1000);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  // Playback sequence to player
  const playSequence = (seqToPlay = sequence) => {
    setIsPlayingDemo(true);
    setGameStatus('playing');
    setPlayerInput([]);

    seqToPlay.forEach((padIndex, step) => {
      setTimeout(() => {
        setActivePad(padIndex);
        sound.playSequenceTone(padIndex, 0.4);
      }, (step + 1) * 900);

      setTimeout(() => {
        setActivePad(null);
      }, (step + 1) * 900 + 550);
    });

    // Finished demo
    setTimeout(() => {
      setIsPlayingDemo(false);
      setGameStatus('ready_for_player');
    }, (seqToPlay.length + 1) * 900);
  };

  // Replay sequence (hint)
  const handleReplayHint = () => {
    if (isPlayingDemo) return;
    sound.playClick();
    setHintsUsed(prev => prev + 1);
    playSequence();
  };

  // Player taps a pad
  const handlePadPress = (padId: number) => {
    if (isPlayingDemo || gameStatus !== 'ready_for_player') return;

    sound.playSequenceTone(padId, 0.35);
    setActivePad(padId);
    setTimeout(() => setActivePad(null), 250);

    const nextInput = [...playerInput, padId];
    setPlayerInput(nextInput);

    const currentStep = nextInput.length - 1;

    // Check if correct at this step
    if (sequence[currentStep] !== padId) {
      // Mistake: gentle cue, not harsh
      sound.playGentlePrompt();
      setAttempts(prev => prev + 1);
      setPlayerInput([]);
      speech.speak("Let's try that sequence again together. Watch closely!");
      setTimeout(() => {
        playSequence();
      }, 700);
      return;
    }

    // If reached end of sequence!
    if (nextInput.length === sequence.length) {
      sound.playMatchSuccess();
      setAttempts(prev => prev + 1);
      setGameStatus('round_complete');

      // Finish session
      const finalAccuracy = Math.max(60, Math.min(100, Math.round((1 / Math.max(1, attempts + 1)) * 100 + 40)));
      setTimeout(() => {
        onComplete({
          gameType: 'sequence-memory',
          gameName: 'Sequence Memory',
          difficulty,
          durationSeconds: timeTaken,
          attempts: attempts + 1,
          hintsUsed,
          score: 100,
          maxScore: 100,
          accuracy: finalAccuracy,
          notes: `Sequence Memory ${difficulty} (${targetLength} items) completed in ${timeTaken}s.`
        });
      }, 800);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Navigation & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { sound.playClick(); onExit(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Games Menu</span>
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
              Sequence Memory
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium capitalize">
              {difficulty} Mode &bull; {targetLength} Musical Steps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 bg-stone-100/90 p-2 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white text-stone-800 text-sm font-bold shadow-sm">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{timeTaken}s</span>
          </div>

          <button
            onClick={handleReplayHint}
            disabled={isPlayingDemo || sequence.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-95"
            title="Replay sequence (Hint)"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Replay ({hintsUsed})</span>
          </button>
        </div>
      </div>

      {/* Gentle Instructions & Status */}
      <div className="mb-6 bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-base sm:text-lg font-bold text-emerald-950">
            {isPlayingDemo && "👀 Watch & Listen as the shapes light up..."}
            {gameStatus === 'ready_for_player' && `👉 Your Turn! Tap the shapes in order (${playerInput.length} / ${targetLength})`}
            {gameStatus === 'round_complete' && "🎉 Wonderful! You matched the sequence perfectly!"}
            {gameStatus === 'idle' && "Press 'Start Sequence' when you are ready."}
          </p>
          <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
            Take your time. Each pad has a gentle musical sound and distinct shape.
          </p>
        </div>

        <button
          onClick={() => speech.speak("Watch the colored shapes light up one by one, then tap them in the exact same order.")}
          className="p-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex-shrink-0 transition"
          title="Listen to instructions"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* 4 Interactive Large Shape Pads */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto my-6">
        {PADS.map((pad) => {
          const isLit = activePad === pad.id;
          return (
            <button
              key={pad.id}
              onClick={() => handlePadPress(pad.id)}
              disabled={isPlayingDemo || gameStatus !== 'ready_for_player'}
              aria-label={pad.label}
              className={`aspect-square rounded-3xl border-4 flex flex-col items-center justify-center p-4 transition-all duration-200 select-none cursor-pointer focus:outline-none ${pad.borderColor} ${
                isLit ? pad.activeColor : pad.inactiveColor
              } ${isPlayingDemo ? 'cursor-not-allowed' : 'active:scale-95'}`}
            >
              <div className="mb-2">{pad.icon}</div>
              <span className={`text-sm sm:text-base font-extrabold ${pad.textColor}`}>
                {pad.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress Dots Indicator */}
      <div className="flex items-center justify-center gap-3 my-6">
        {Array.from({ length: targetLength }).map((_, idx) => {
          const isDone = idx < playerInput.length;
          return (
            <div
              key={idx}
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                isDone
                  ? 'bg-emerald-600 text-white scale-110 shadow'
                  : 'bg-stone-200 text-stone-400'
              }`}
            >
              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          );
        })}
      </div>

      {/* Control Actions */}
      <div className="flex justify-center gap-4">
        {gameStatus === 'idle' ? (
          <button
            onClick={() => playSequence()}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-lg shadow-lg shadow-emerald-800/30 transition active:scale-95"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>Start Sequence</span>
          </button>
        ) : (
          <button
            onClick={() => { sound.playClick(); initGame(); }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-base border border-stone-300 transition"
          >
            <RotateCcw className="w-4 h-4 text-stone-600" />
            <span>New Sequence</span>
          </button>
        )}
      </div>
    </div>
  );
};
