import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Clock, 
  HelpCircle, 
  Repeat, 
  Smile, 
  ThumbsUp, 
  Frown, 
  Coffee, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { GameSession, UserFeedback } from '../../types';
import { sound } from '../../services/soundService';
import { speech } from '../../services/speechService';

interface Props {
  sessionSummary: Omit<GameSession, 'id' | 'timestamp' | 'feedback'>;
  onSaveFeedback: (feedback: UserFeedback) => void;
}

export const FeedbackModal: React.FC<Props> = ({ sessionSummary, onSaveFeedback }) => {
  const [selectedFeedback, setSelectedFeedback] = useState<UserFeedback>('Comfortable');

  useEffect(() => {
    // Play celebratory sound & confetti
    sound.playCelebration();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#3F7D58', '#E11D48', '#EE8E32', '#6BA2BC', '#F5B066']
      });
    } catch (e) {}

    // Gentle spoken encouragement
    speech.speak(`Wonderful job completing ${sessionSummary.gameName}! How did this activity feel for you today?`);
  }, [sessionSummary.gameName]);

  const feedbackOptions: {
    value: UserFeedback;
    label: string;
    subtext: string;
    icon: React.ReactNode;
    colorClasses: string;
  }[] = [
    {
      value: 'Too Easy',
      label: 'Too Easy',
      subtext: 'I could try a slightly bigger challenge next time',
      icon: <Sparkles className="w-6 h-6 text-emerald-600" />,
      colorClasses: 'border-emerald-300 hover:bg-emerald-50 text-emerald-950',
    },
    {
      value: 'Comfortable',
      label: 'Comfortable',
      subtext: 'Felt just right, relaxing and enjoyable',
      icon: <Smile className="w-6 h-6 text-amber-500" />,
      colorClasses: 'border-amber-300 hover:bg-amber-50 text-amber-950',
    },
    {
      value: 'Too Difficult',
      label: 'Too Difficult',
      subtext: 'A bit tricky, I prefer gentler exercises',
      icon: <Frown className="w-6 h-6 text-rose-500" />,
      colorClasses: 'border-rose-300 hover:bg-rose-50 text-rose-950',
    },
    {
      value: 'I Want a Break',
      label: 'I Want a Break',
      subtext: 'Ready for tea, water, or resting my eyes',
      icon: <Coffee className="w-6 h-6 text-stone-600" />,
      colorClasses: 'border-stone-300 hover:bg-stone-50 text-stone-900',
    },
  ];

  const handleSelect = (val: UserFeedback) => {
    sound.playClick();
    setSelectedFeedback(val);
  };

  const handleConfirm = () => {
    sound.playClick();
    onSaveFeedback(selectedFeedback);
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="feedback-modal-title"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-100 flex flex-col gap-6">
        
        {/* Header Celebration */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Trophy className="w-9 h-9" />
          </div>
          <h2 id="feedback-modal-title" className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            Splendid Effort!
          </h2>
          <p className="text-stone-600 text-base sm:text-lg mt-1 font-medium">
            You just completed <span className="text-emerald-800 font-bold">{sessionSummary.gameName}</span> on{' '}
            <span className="capitalize font-bold text-stone-800">{sessionSummary.difficulty}</span> mode.
          </p>
        </div>

        {/* Gentle Metrics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
          <div className="flex flex-col items-center justify-center text-center p-2">
            <Clock className="w-5 h-5 text-stone-400 mb-1" />
            <span className="text-xs text-stone-500 font-medium">Time Taken</span>
            <span className="text-lg font-bold text-stone-800">{sessionSummary.durationSeconds}s</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-2">
            <Repeat className="w-5 h-5 text-stone-400 mb-1" />
            <span className="text-xs text-stone-500 font-medium">Attempts</span>
            <span className="text-lg font-bold text-stone-800">{sessionSummary.attempts}</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-2">
            <HelpCircle className="w-5 h-5 text-stone-400 mb-1" />
            <span className="text-xs text-stone-500 font-medium">Hints Used</span>
            <span className="text-lg font-bold text-stone-800">{sessionSummary.hintsUsed}</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-2">
            <ThumbsUp className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-xs text-stone-500 font-medium">Accuracy</span>
            <span className="text-lg font-bold text-emerald-700">{sessionSummary.accuracy}%</span>
          </div>
        </div>

        {/* How did it feel? (Feedback selection) */}
        <div>
          <label className="block text-base sm:text-lg font-bold text-stone-900 mb-3 text-center">
            How did this activity feel for you?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {feedbackOptions.map((opt) => {
              const isSelected = selectedFeedback === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${opt.colorClasses} ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-400 shadow-md scale-[1.02]'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <div className="mt-0.5">{opt.icon}</div>
                  <div>
                    <span className="font-extrabold text-base block">{opt.label}</span>
                    <span className="text-xs text-stone-500 leading-tight block mt-0.5">{opt.subtext}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm Action */}
        <div className="pt-2">
          <button
            onClick={handleConfirm}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-800/30 transition focus:outline-none focus:ring-4 focus:ring-emerald-400"
          >
            <span>Save & See Adaptive AI Recommendation</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
