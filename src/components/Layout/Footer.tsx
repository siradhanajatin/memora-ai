import React from 'react';
import { DisclaimerBanner } from './DisclaimerBanner';
import { Heart, ShieldCheck, PhoneCall } from 'lucide-react';
import { ActiveTab } from './Header';
import { sound } from '../../services/soundService';

interface Props {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<Props> = ({ setActiveTab }) => {
  return (
    <footer className="mt-16">
      {/* Supportive Contact Callout Banner */}
      <div className="bg-emerald-900 text-emerald-100 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              <Heart className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <p className="font-extrabold text-white text-base">Here for you and your loved ones</p>
              <p className="text-xs text-emerald-200">
                Designed to support cognitive well-being with dignity, warmth, and explainable AI.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('caregiver');
              }}
              className="px-4 py-2 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition active:scale-95 shadow-sm"
            >
              Caregiver Portal
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Medical Disclaimer Footer */}
      <DisclaimerBanner variant="footer" />
    </footer>
  );
};
