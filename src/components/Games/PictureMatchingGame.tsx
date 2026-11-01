import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  Volume2, 
  ArrowLeft,
  Eye,
  Trophy
} from 'lucide-react';
import { DifficultyLevel, GameSession } from '../../types';
import { sound } from '../../services/soundService';
import { speech } from '../../services/speechService';

interface CardItem {
  id: number;
  pairKey: string;
  name: string;
  icon: string;
  bgColor: string;
  borderColor: string;
  flipped: boolean;
  matched: boolean;
}

const CARD_CATALOG = [
  { pairKey: 'rose', name: 'Velvet Rose', icon: '🌹', bgColor: 'bg-rose-50', borderColor: 'border-rose-300' },
  { pairKey: 'teapot', name: 'Ceramic Teapot', icon: '🫖', bgColor: 'bg-amber-50', borderColor: 'border-amber-300' },
  { pairKey: 'robin', name: 'Garden Robin', icon: '🐦', bgColor: 'bg-sky-50', borderColor: 'border-sky-300' },
  { pairKey: 'sunflower', name: 'Sunny Flower', icon: '🌻', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300' },
  { pairKey: 'cat', name: 'Sleepy Cat', icon: '🐱', bgColor: 'bg-orange-50', borderColor: 'border-orange-300' },
  { pairKey: 'camera', name: 'Film Camera', icon: '📷', bgColor: 'bg-stone-50', borderColor: 'border-stone-300' },
  { pairKey: 'gramophone', name: 'Gramophone', icon: '📻', bgColor: 'bg-purple-50', borderColor: 'border-purple-300' },
  { pairKey: 'watering_can', name: 'Watering Can', icon: '🪴', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-300' },
];

interface Props {
  difficulty: DifficultyLevel;
  onExit: () => void;
  onComplete: (summary: Omit<GameSession, 'id' | 'timestamp' | 'feedback'>) => void;
}

export const PictureMatchingGame: React.FC<Props> = ({
  difficulty,
  onExit,
  onComplete
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isShowingHint, setIsShowingHint] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Determine pair count from difficulty:
  // Easy: 4 pairs (8 cards, 4x2)
  // Medium: 6 pairs (12 cards, 4x3)
  // Hard: 8 pairs (16 cards, 4x4)
  const pairCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;

  const initGame = () => {
    const selectedCatalog = CARD_CATALOG.slice(0, pairCount);
    const deck: CardItem[] = [];

    selectedCatalog.forEach((item, index) => {
      deck.push({
        id: index * 2,
        pairKey: item.pairKey,
        name: item.name,
        icon: item.icon,
        bgColor: item.bgColor,
        borderColor: item.borderColor,
        flipped: false,
        matched: false
      });
      deck.push({
        id: index * 2 + 1,
        pairKey: item.pairKey,
        name: item.name,
        icon: item.icon,
        bgColor: item.bgColor,
        borderColor: item.borderColor,
        flipped: false,
        matched: false
      });
    });

    // Shuffle deck
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setAttempts(0);
    setHintsUsed(0);
    setTimeTaken(0);
    setIsProcessing(false);
    setIsGameActive(true);

    speech.speak(`Welcome to Picture Matching on ${difficulty} difficulty. Tap two cards to find their matching pairs.`);
  };

  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (isGameActive) {
      timerRef.current = setInterval(() => {
        setTimeTaken(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameActive]);

  // Card click handler
  const handleCardClick = (cardId: number) => {
    if (isProcessing || isShowingHint) return;

    const clickedCard = cards.find(c => c.id === cardId);
    if (!clickedCard || clickedCard.flipped || clickedCard.matched) return;

    sound.playClick();

    // Flip card
    const updatedCards = cards.map(c => c.id === cardId ? { ...c, flipped: true } : c);
    setCards(updatedCards);

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsProcessing(true);
      setAttempts(prev => prev + 1);

      const firstCard = updatedCards.find(c => c.id === newSelected[0])!;
      const secondCard = updatedCards.find(c => c.id === newSelected[1])!;

      if (firstCard.pairKey === secondCard.pairKey) {
        // Matched!
        setTimeout(() => {
          sound.playMatchSuccess();
          const matchedCards = updatedCards.map(c => 
            c.id === firstCard.id || c.id === secondCard.id 
              ? { ...c, matched: true, flipped: true } 
              : c
          );
          setCards(matchedCards);
          setSelectedCards([]);
          setIsProcessing(false);

          // Check if all pairs matched
          const remainingUnmatched = matchedCards.filter(c => !c.matched);
          if (remainingUnmatched.length === 0) {
            handleGameComplete(timeTaken, attempts + 1, hintsUsed);
          }
        }, 500);
      } else {
        // Not a match: flip back gently
        setTimeout(() => {
          sound.playGentlePrompt();
          setCards(prev => prev.map(c => 
            newSelected.includes(c.id) ? { ...c, flipped: false } : c
          ));
          setSelectedCards([]);
          setIsProcessing(false);
        }, 1100);
      }
    }
  };

  // Hint button: briefly flashes all unmatched cards
  const triggerHint = () => {
    if (isProcessing || isShowingHint) return;
    sound.playClick();
    setHintsUsed(prev => prev + 1);
    setIsShowingHint(true);

    // Flip all unmatched cards face up
    setCards(prev => prev.map(c => (!c.matched ? { ...c, flipped: true } : c)));

    // Revert after 1.8 seconds
    setTimeout(() => {
      setCards(prev => prev.map(c => (!c.matched ? { ...c, flipped: false } : c)));
      setSelectedCards([]);
      setIsShowingHint(false);
    }, 1800);
  };

  const handleGameComplete = (finalTime: number, finalAttempts: number, finalHints: number) => {
    setIsGameActive(false);
    // Accuracy calculation: baseline attempts needed is pairCount
    // If attempts === pairCount, 100% accuracy.
    const accuracy = Math.max(50, Math.min(100, Math.round((pairCount / Math.max(pairCount, finalAttempts)) * 100)));

    onComplete({
      gameType: 'picture-matching',
      gameName: 'Picture Matching',
      difficulty,
      durationSeconds: finalTime,
      attempts: finalAttempts,
      hintsUsed: finalHints,
      score: 100,
      maxScore: 100,
      accuracy,
      notes: `Picture matching ${difficulty} completed in ${finalTime}s with ${finalHints} hints.`
    });
  };

  const matchedPairsCount = cards.filter(c => c.matched).length / 2;

  // Layout grid classes based on pairCount
  const gridClasses = {
    4: 'grid-cols-4 max-w-2xl', // 4x2
    6: 'grid-cols-3 sm:grid-cols-4 max-w-3xl', // 4x3
    8: 'grid-cols-4 max-w-4xl', // 4x4
  }[pairCount];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Header & Navigation */}
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
              Picture Matching
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium capitalize">
              {difficulty} Mode &bull; {pairCount} Matching Pairs
            </p>
          </div>
        </div>

        {/* Live Metrics Header */}
        <div className="flex items-center gap-2 sm:gap-3 bg-stone-100/90 p-2 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white text-stone-800 text-sm font-bold shadow-sm">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{timeTaken}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white text-stone-800 text-sm font-bold shadow-sm">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{matchedPairsCount} / {pairCount}</span>
          </div>

          <button
            onClick={triggerHint}
            disabled={isShowingHint || isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-95"
            title="Flash card positions (counts as a hint)"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Hint ({hintsUsed})</span>
          </button>
        </div>
      </div>

      {/* Gentle Instructions Banner */}
      <div className="mb-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4 text-emerald-950">
        <p className="text-sm sm:text-base font-medium">
          💡 Tap any card to reveal its picture, then find its matching companion. Take your time!
        </p>
        <button
          onClick={() => speech.speak("Tap any card to turn it over, then find another card with the same picture. There is no rush.")}
          className="p-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex-shrink-0 transition"
          title="Listen to instructions"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Card Grid */}
      <div className={`grid ${gridClasses} gap-3 sm:gap-4 mx-auto`}>
        {cards.map((card) => {
          const isRevealed = card.flipped || card.matched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={isRevealed || isProcessing || isShowingHint}
              aria-label={isRevealed ? `${card.name}` : "Hidden memory card"}
              className={`aspect-square rounded-2xl sm:rounded-3xl border-3 flex flex-col items-center justify-center p-3 transition-all duration-300 transform select-none ${
                card.matched
                  ? 'bg-emerald-100/90 border-emerald-500 ring-2 ring-emerald-300 opacity-90 scale-95'
                  : isRevealed
                  ? `${card.bgColor} ${card.borderColor} shadow-lg scale-100`
                  : 'bg-white hover:bg-stone-50 border-stone-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer'
              }`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center justify-center text-center animate-in zoom-in-75 duration-200">
                  <span className="text-4xl sm:text-5xl mb-1 filter drop-shadow-sm">{card.icon}</span>
                  <span className="text-xs sm:text-sm font-extrabold text-stone-800 line-clamp-1">
                    {card.name}
                  </span>
                  {card.matched && (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Matched
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-stone-400">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200 mb-1">
                    <Sparkles className="w-5 h-5 text-emerald-600/70" />
                  </div>
                  <span className="text-xs font-bold text-stone-500">Tap to flip</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Controls */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => { sound.playClick(); initGame(); }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-base border border-stone-300 transition"
        >
          <RotateCcw className="w-4 h-4 text-stone-600" />
          <span>Shuffle & Restart</span>
        </button>
      </div>
    </div>
  );
};
