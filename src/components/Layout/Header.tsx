import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Eye, 
  Type, 
  Clock, 
  Calendar,
  Gamepad2,
  Image as ImageIcon,
  CheckCircle2,
  Activity,
  Home
} from 'lucide-react';
import { TextSize, UserPreferences } from '../../types';
import { sound } from '../../services/soundService';
import { speech } from '../../services/speechService';

export type ActiveTab = 'home' | 'games' | 'memory-cards' | 'reminders' | 'caregiver';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  preferences,
  onUpdatePreferences,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTabChange = (tab: ActiveTab) => {
    sound.playClick();
    setActiveTab(tab);
  };

  const cycleTextSize = () => {
    sound.playClick();
    const sizes: TextSize[] = ['normal', 'large', 'extra-large'];
    const nextIndex = (sizes.indexOf(preferences.textSize) + 1) % sizes.length;
    onUpdatePreferences({ textSize: sizes[nextIndex] });
  };

  const toggleSound = () => {
    sound.playClick();
    const next = preferences.soundVolume > 0 ? 0 : 0.6;
    sound.setVolume(next);
    sound.setEnabled(next > 0);
    onUpdatePreferences({ soundVolume: next });
  };

  const toggleSpeech = () => {
    sound.playClick();
    const next = !preferences.speechEnabled;
    speech.setEnabled(next);
    if (!next) speech.stop();
    onUpdatePreferences({ speechEnabled: next });
    if (next) {
      speech.speak("Voice guidance enabled. I will read important prompts aloud for you.");
    }
  };

  const toggleContrast = () => {
    sound.playClick();
    onUpdatePreferences({ highContrast: !preferences.highContrast });
  };

  const timeFormatted = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateFormatted = currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'games', label: 'Cognitive Games', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'memory-cards', label: 'Memory Cards', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'reminders', label: 'Daily Reminders', icon: <CheckCircle2 className="w-5 h-5" /> },
    { id: 'caregiver', label: 'Caregiver Portal', icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <header className="bg-white/95 backdrop-blur border-b border-stone-200 sticky top-0 z-40 shadow-sm transition-colors">
      {/* Top utility bar: Date, Time & Accessibility quick controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-600">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-200">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-stone-800">{timeFormatted}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-stone-500">
            <Calendar className="w-4 h-4 text-stone-400" />
            <span>{dateFormatted}</span>
          </div>
        </div>

        {/* Accessibility Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Text Size adjuster */}
          <button
            onClick={cycleTextSize}
            title={`Current text size: ${preferences.textSize}. Click to change.`}
            aria-label="Change text size"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition text-xs sm:text-sm active:scale-95"
          >
            <Type className="w-4 h-4 text-stone-500" />
            <span className="hidden sm:inline">Text:</span>
            <span className="font-bold text-emerald-700 uppercase">{preferences.textSize.replace('-', ' ')}</span>
          </button>

          {/* Voice Guidance / TTS toggle */}
          <button
            onClick={toggleSpeech}
            title={preferences.speechEnabled ? "Voice narration active (Click to mute)" : "Voice narration muted (Click to enable)"}
            aria-label="Toggle voice guidance"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition text-xs sm:text-sm active:scale-95 ${
              preferences.speechEnabled
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Voice:</span>
            <span className="font-bold">{preferences.speechEnabled ? 'On' : 'Off'}</span>
          </button>

          {/* Sound Audio toggle */}
          <button
            onClick={toggleSound}
            title={preferences.soundVolume > 0 ? "Sound effects on" : "Sound effects muted"}
            aria-label="Toggle sound effects"
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg font-medium transition text-xs sm:text-sm active:scale-95 ${
              preferences.soundVolume > 0
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {preferences.soundVolume > 0 ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-rose-600" />}
          </button>

          {/* High Contrast Mode toggle */}
          <button
            onClick={toggleContrast}
            title="Toggle high contrast view"
            aria-label="Toggle high contrast mode"
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg font-medium transition text-xs sm:text-sm active:scale-95 ${
              preferences.highContrast
                ? 'bg-stone-900 text-yellow-300 ring-2 ring-yellow-400'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden md:inline ml-1">{preferences.highContrast ? 'High Contrast' : 'Contrast'}</span>
          </button>
        </div>
      </div>

      {/* Main Branding & Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand identity */}
        <div 
          onClick={() => handleTabChange('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 fill-white/20 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-emerald-950 font-serif">
                MEMORA <span className="text-emerald-700 font-sans text-xl font-bold px-1.5 py-0.5 rounded-md bg-emerald-100">AI</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-medium tracking-wide">
              Preserving memories. Empowering lives.
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Large, accessible, touch friendly */}
        <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-semibold text-sm sm:text-base whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 active:scale-95 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-800/30 font-bold'
                    : 'bg-stone-100/80 hover:bg-stone-200/80 text-stone-700 hover:text-stone-900'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-emerald-700'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
