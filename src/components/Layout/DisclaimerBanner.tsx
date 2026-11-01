import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface Props {
  variant?: 'top' | 'footer' | 'inline';
}

export const DisclaimerBanner: React.FC<Props> = ({ variant = 'inline' }) => {
  if (variant === 'top') {
    return (
      <div 
        role="note"
        aria-label="Medical disclaimer notice"
        className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs md:text-sm text-amber-900 flex items-center justify-center gap-2 text-center"
      >
        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>
          <strong className="font-semibold">Notice:</strong> MEMORA AI is a supportive cognitive engagement tool and memory aid. It is not a medical device and does not diagnose, treat, or measure clinical dementia progression.
        </span>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div 
        role="contentinfo"
        className="bg-stone-100 border-t border-stone-200 px-4 py-5 text-center text-xs md:text-sm text-stone-600"
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2">
          <Info className="w-4 h-4 text-stone-500 flex-shrink-0" />
          <p>
            <strong>Mandatory Medical Notice:</strong> MEMORA AI is a supportive cognitive engagement tool and memory aid. It is not a medical device and does not diagnose, treat, or measure clinical dementia progression.
          </p>
        </div>
        <p className="mt-2 text-stone-500 text-xs">
          MEMORA AI &copy; 2026 &bull; Designed with compassion, dignity, and explainable adaptive technology for older adults and their caregivers.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs md:text-sm text-emerald-900 flex items-start gap-2.5">
      <Info className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-emerald-950">Supportive Engagement Tool</p>
        <p className="text-emerald-800 text-xs mt-0.5">
          MEMORA AI is a supportive cognitive engagement tool and memory aid. It is not a medical device and does not diagnose, treat, or measure clinical dementia progression.
        </p>
      </div>
    </div>
  );
};
