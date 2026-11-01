import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  HelpCircle, 
  Volume2, 
  CheckCircle2, 
  Sparkles, 
  Trophy,
  Info
} from 'lucide-react';
import { DifficultyLevel, GameSession } from '../../types';
import { sound } from '../../services/soundService';
import { speech } from '../../services/speechService';

interface ObjectQuestion {
  id: string;
  correctName: string;
  imageEmoji: string;
  imagePlaceholderUrl: string;
  hintClue: string;
  options: string[];
  historicalStory: string;
}

const OBJECT_REPOSITORY: ObjectQuestion[] = [
  {
    id: 'obj-1',
    correctName: 'Porcelain Teapot',
    imageEmoji: '🫖',
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    hintClue: 'Brewed with warm water and loose tea leaves, often served with a splash of milk and cookies.',
    options: ['Porcelain Teapot', 'Flower Vase', 'Milk Jug', 'Cooking Pot'],
    historicalStory: 'A timeless staple of afternoon teatime and cozy kitchen chats.'
  },
  {
    id: 'obj-2',
    correctName: 'Rotary Dial Telephone',
    imageEmoji: '☎️',
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1520923642038-b4259aceffd7?auto=format&fit=crop&w=600&q=80',
    hintClue: 'You spun the numbered wheel with your finger to call friends and family.',
    options: ['Rotary Dial Telephone', 'Typewriter', 'Cash Register', 'Kitchen Clock'],
    historicalStory: 'Famous for the gentle whirring sound as the dial turned back.'
  },
  {
    id: 'obj-3',
    correctName: 'Antique Sewing Machine',
    imageEmoji: '🧵',
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    hintClue: 'Powered by a foot pedal or wheel to stitch quilts, dresses, and mend clothing.',
    options: ['Antique Sewing Machine', 'Printing Press', 'Gramophone', 'Spinning Wheel'],
    historicalStory: 'Crafted with sturdy black iron and gold filigree in many childhood homes.'
  },
  {
    id: 'obj-4',
    correctName: 'Vintage Tabletop Radio',
    imageEmoji: '📻',
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
    hintClue: 'Families gathered around its warm wooden cabinet in the evenings to listen to evening serials.',
    options: ['Vintage Tabletop Radio', 'Record Player', 'Microwave', 'Film Projector'],
    historicalStory: 'Brought music, fireside chats, and baseball broadcasts into living rooms.'
  },
  {
    id: 'obj-5',
    correctName: 'Grandfather Clock',
    imageEmoji: '🕰️',
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    hintClue: 'Stands tall against the wall with a swinging brass pendulum that chimes on the hour.',
    options: ['Grandfather Clock', 'Tall Bookcase', 'Coat Rack', 'Display Cabinet'],
    historicalStory: 'A symbol of enduring home warmth whose steady tick provided a comforting presence.'
  },
  {
    id: 'obj-6',
    correctName: 'Fountain Pen & Ink',
    imageEmoji: '✒️',
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    hintClue: 'Dipped in dark ink to write heartfelt letters and pen cursive signatures.',
    options: ['Fountain Pen & Ink', 'Paintbrush', 'Wooden Ruler', 'Pocket Knife'],
    historicalStory: 'Used to write cherished handwritten postcards and love letters across the miles.'
  },
  {
    id: 'obj-7',
    correctName: 'Classic Rocking Chair',
    imageEmoji: '🪑',
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1580481077194-c760232490df?auto=format&fit=crop&w=600&q=80',
    hintClue: 'Curved wooden rails that sway gently back and forth on the porch.',
    options: ['Classic Rocking Chair', 'Dining Bench', 'Footstool', 'Cradle'],
    historicalStory: 'Perfect for reading novels, knitting wool blankets, or lulling children to sleep.'
  }
];

interface Props {
  difficulty: DifficultyLevel;
  onExit: () => void;
  onComplete: (summary: Omit<GameSession, 'id' | 'timestamp' | 'feedback'>) => void;
}

export const ObjectRecognitionGame: React.FC<Props> = ({
  difficulty,
  onExit,
  onComplete,
}) => {
  const roundCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;

  const [questions, setQuestions] = useState<ObjectQuestion[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initGame = () => {
    // Shuffle and pick roundCount questions
    const shuffled = [...OBJECT_REPOSITORY].sort(() => Math.random() - 0.5).slice(0, roundCount);
    // Shuffle options inside each question
    const finalized = shuffled.map(q => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5)
    }));

    setQuestions(finalized);
    setCurrentRound(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setHintsUsed(0);
    setAttempts(0);
    setTimeTaken(0);
    setCorrectAnswersCount(0);

    speech.speak(`Object Recognition on ${difficulty} difficulty. Look at the familiar item and choose what it is called.`);
  };

  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [difficulty]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeTaken(prev => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentQ = questions[currentRound];

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQ) return;

    sound.playClick();
    setSelectedOption(option);
    setIsAnswered(true);
    setAttempts(prev => prev + 1);

    const correct = option === currentQ.correctName;
    setIsCorrect(correct);

    if (correct) {
      sound.playMatchSuccess();
      setCorrectAnswersCount(prev => prev + 1);
      speech.speak(`Correct! That is a ${currentQ.correctName}. ${currentQ.historicalStory}`);
    } else {
      sound.playGentlePrompt();
      speech.speak(`Close! That is actually a ${currentQ.correctName}.`);
    }
  };

  const handleNextRound = () => {
    sound.playClick();
    if (currentRound + 1 >= questions.length) {
      // Game Complete!
      const totalAttempts = attempts;
      const finalAccuracy = Math.round((Math.max(1, correctAnswersCount) / questions.length) * 100);

      onComplete({
        gameType: 'object-recognition',
        gameName: 'Object Recognition',
        difficulty,
        durationSeconds: timeTaken,
        attempts: totalAttempts,
        hintsUsed,
        score: Math.round((correctAnswersCount / questions.length) * 100),
        maxScore: 100,
        accuracy: finalAccuracy,
        notes: `Identified ${correctAnswersCount}/${questions.length} nostalgic objects in ${timeTaken}s.`
      });
    } else {
      setCurrentRound(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
    }
  };

  const triggerClueHint = () => {
    if (showHint || !currentQ) return;
    sound.playClick();
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
    speech.speak(`Hint: ${currentQ.hintClue}`);
  };

  if (!currentQ) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Header */}
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
              Object Recognition
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium capitalize">
              Round {currentRound + 1} of {questions.length} &bull; {difficulty} Mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 bg-stone-100/90 p-2 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white text-stone-800 text-sm font-bold shadow-sm">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{timeTaken}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white text-stone-800 text-sm font-bold shadow-sm">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{correctAnswersCount} / {questions.length}</span>
          </div>

          <button
            onClick={triggerClueHint}
            disabled={showHint || isAnswered}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-95"
            title="Read clue hint"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Clue ({hintsUsed})</span>
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-xl p-6 sm:p-8 flex flex-col items-center">
        
        {/* Object Visual Presentation */}
        <div className="w-full max-w-md h-56 sm:h-64 rounded-3xl bg-stone-50 border-2 border-stone-200 overflow-hidden relative flex flex-col items-center justify-center mb-6 shadow-inner group">
          <img
            src={currentQ.imagePlaceholderUrl}
            alt={currentQ.correctName}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to large emoji presentation if external image fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-stone-900/10 pointer-events-none" />
          
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm flex items-center gap-1.5 text-xs font-bold text-stone-700">
            <span className="text-xl">{currentQ.imageEmoji}</span>
            <span>Familiar Item</span>
          </div>
        </div>

        {/* Prompt Question */}
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block mb-2">
            Reminiscence & Semantic Memory
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            What is the name of this familiar item?
          </h3>
        </div>

        {/* Clue Hint Box (if revealed) */}
        {showHint && (
          <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-950 flex items-start gap-2.5 animate-in fade-in">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Gentle Clue:</strong>
              <p className="mt-0.5 text-amber-900">{currentQ.hintClue}</p>
            </div>
          </div>
        )}

        {/* 4 Multiple Choice Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mb-6">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isThisCorrect = option === currentQ.correctName;

            let buttonStyles = "border-stone-200 bg-stone-50/80 hover:bg-stone-100 text-stone-900";
            if (isAnswered) {
              if (isThisCorrect) {
                buttonStyles = "border-emerald-600 bg-emerald-100 text-emerald-950 ring-2 ring-emerald-500 font-extrabold";
              } else if (isSelected && !isThisCorrect) {
                buttonStyles = "border-rose-400 bg-rose-50 text-rose-950 opacity-80";
              } else {
                buttonStyles = "border-stone-200 bg-stone-50 text-stone-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`w-full py-4 px-5 rounded-2xl border-2 text-base sm:text-lg font-bold text-left transition-all flex items-center justify-between ${buttonStyles} ${
                  !isAnswered ? 'active:scale-98 cursor-pointer' : 'cursor-default'
                }`}
              >
                <span>{option}</span>
                {isAnswered && isThisCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 flex-shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Next Button */}
        {isAnswered && (
          <div className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-stone-700">
                <p className="font-extrabold text-stone-900">
                  {isCorrect ? "Spot on! That's it!" : `That's a ${currentQ.correctName}.`}
                </p>
                <p className="mt-0.5 text-stone-600">{currentQ.historicalStory}</p>
              </div>
            </div>

            <button
              onClick={handleNextRound}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base whitespace-nowrap shadow-md transition active:scale-95 flex-shrink-0"
            >
              {currentRound + 1 >= questions.length ? "Finish Activity" : "Next Item 👉"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
