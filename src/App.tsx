import React, { useState, useEffect, useMemo } from 'react';
import { 
  GameSession, 
  MemoryCard, 
  Reminder, 
  UserPreferences, 
  GameType, 
  DifficultyLevel, 
  UserFeedback,
  CaregiverOverview
} from './types';
import { db } from './services/storageService';
import { XAIEngine } from './services/xaiEngine';
import { sound } from './services/soundService';
import { speech } from './services/speechService';

import { Header, ActiveTab } from './components/Layout/Header';
import { DisclaimerBanner } from './components/Layout/DisclaimerBanner';
import { Footer } from './components/Layout/Footer';
import { FeedbackModal } from './components/Common/FeedbackModal';

import { HomePage } from './pages/HomePage';
import { GamesHubPage } from './pages/GamesHubPage';
import { MemoryCardsPage } from './pages/MemoryCardsPage';
import { RemindersPage } from './pages/RemindersPage';
import { CaregiverPage } from './pages/CaregiverPage';

export function App() {
  // Database states
  const [sessions, setSessions] = useState<GameSession[]>(() => db.getSessions());
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>(() => db.getMemoryCards());
  const [reminders, setReminders] = useState<Reminder[]>(() => db.getReminders());
  const [preferences, setPreferences] = useState<UserPreferences>(() => db.getPreferences());

  // Navigation & Game state
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel>('easy');
  const [completedSummary, setCompletedSummary] = useState<Omit<GameSession, 'id' | 'timestamp' | 'feedback'> | null>(null);

  // Sync sound & speech preferences on load
  useEffect(() => {
    sound.setEnabled(preferences.soundVolume > 0);
    sound.setVolume(preferences.soundVolume);
    speech.setEnabled(preferences.speechEnabled);
  }, [preferences]);

  // Explainable AI Recommendation calculation
  const recommendation = useMemo(() => {
    return XAIEngine.generateRecommendation(sessions);
  }, [sessions]);

  // Caregiver Overview KPI calculation
  const overview: CaregiverOverview = useMemo(() => {
    const totalSessions = sessions.length;
    const totalSeconds = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
    const avgDuration = totalSessions > 0 ? Math.round(totalSeconds / totalSessions) : 0;

    const completedReminders = reminders.filter(r => r.completed).length;
    const reminderRate = reminders.length > 0 ? Math.round((completedReminders / reminders.length) * 100) : 0;

    const stabilityIndex = XAIEngine.calculateCognitiveStability(sessions);

    // Favorite game by frequency
    const gameCounts: Record<GameType, number> = {
      'picture-matching': 0,
      'sequence-memory': 0,
      'object-recognition': 0,
    };
    sessions.forEach(s => {
      gameCounts[s.gameType]++;
    });
    const favorite = Object.entries(gameCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'picture-matching';
    const favoriteNames = {
      'picture-matching': 'Picture Matching',
      'sequence-memory': 'Sequence Memory',
      'object-recognition': 'Object Recognition',
    };

    const comfortDistribution: Record<UserFeedback, number> = {
      'Comfortable': 0,
      'Too Easy': 0,
      'Too Difficult': 0,
      'I Want a Break': 0,
    };
    sessions.forEach(s => {
      if (comfortDistribution[s.feedback] !== undefined) {
        comfortDistribution[s.feedback]++;
      }
    });

    return {
      totalSessions,
      averageDurationSeconds: avgDuration,
      reminderCompletionRate: reminderRate,
      cognitiveStabilityIndex: stabilityIndex,
      favoriteGame: favoriteNames[favorite as GameType],
      comfortDistribution,
    };
  }, [sessions, reminders]);

  // Handlers for Preferences
  const handleUpdatePreferences = (partial: Partial<UserPreferences>) => {
    const updated = db.savePreferences(partial);
    setPreferences(updated);
  };

  // Handlers for Games
  const handleStartGame = (game: GameType, difficulty: DifficultyLevel) => {
    setActiveGame(game);
    setActiveDifficulty(difficulty);
    setActiveTab('games');
  };

  const handleExitGame = () => {
    setActiveGame(null);
  };

  const handleGameComplete = (summary: Omit<GameSession, 'id' | 'timestamp' | 'feedback'>) => {
    setCompletedSummary(summary);
  };

  const handleSaveFeedback = (feedback: UserFeedback) => {
    if (!completedSummary) return;

    const newSession: GameSession = {
      ...completedSummary,
      id: `sess-${Date.now()}`,
      timestamp: new Date().toISOString(),
      feedback,
    };

    const updated = db.saveSession(newSession);
    setSessions(updated);
    setCompletedSummary(null);
    setActiveGame(null);

    // Reassurance message
    if (feedback === 'I Want a Break') {
      speech.speak("Take a relaxing pause! Enjoy some water or a warm cup of tea.");
    }
  };

  // Handlers for Memory Cards
  const handleAddCard = (card: MemoryCard) => {
    const updated = db.saveMemoryCard(card);
    setMemoryCards(updated);
  };

  const handleDeleteCard = (id: string) => {
    const updated = db.deleteMemoryCard(id);
    setMemoryCards(updated);
  };

  const handleReviewedCard = (id: string) => {
    db.markCardReviewed(id);
  };

  // Handlers for Reminders
  const handleToggleReminder = (id: string) => {
    const { updated } = db.toggleReminder(id);
    setReminders(updated);
  };

  const handleAddReminder = (reminder: Reminder) => {
    const updated = db.saveReminder(reminder);
    setReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = db.deleteReminder(id);
    setReminders(updated);
  };

  const handleResetDemoData = () => {
    db.resetToSeedData();
    setSessions(db.getSessions());
    setMemoryCards(db.getMemoryCards());
    setReminders(db.getReminders());
    setPreferences(db.getPreferences());
  };

  // Dynamic root accessibility classes
  const textSizeClass = {
    'normal': '',
    'large': 'text-lg',
    'extra-large': 'text-xl',
  }[preferences.textSize];

  const contrastClass = preferences.highContrast 
    ? 'contrast-125 saturate-150 bg-stone-100 text-black' 
    : '';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${textSizeClass} ${contrastClass}`}>
      
      {/* Mandatory Disclaimer Top Notice */}
      <DisclaimerBanner variant="top" />

      {/* Main Accessible Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveGame(null); // Return to hub if leaving game
          setActiveTab(tab);
        }}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            recommendation={recommendation}
            sessions={sessions}
            memoryCards={memoryCards}
            reminders={reminders}
            onStartGame={handleStartGame}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'games' && (
          <GamesHubPage
            activeGame={activeGame}
            activeDifficulty={activeDifficulty}
            recommendation={recommendation}
            onStartGame={handleStartGame}
            onExitGame={handleExitGame}
            onCompleteGame={handleGameComplete}
          />
        )}

        {activeTab === 'memory-cards' && (
          <MemoryCardsPage
            memoryCards={memoryCards}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
            onReviewedCard={handleReviewedCard}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersPage
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}

        {activeTab === 'caregiver' && (
          <CaregiverPage
            sessions={sessions}
            reminders={reminders}
            overview={overview}
            recommendation={recommendation}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      {/* End-of-Game Feedback Celebration Modal */}
      {completedSummary && (
        <FeedbackModal
          sessionSummary={completedSummary}
          onSaveFeedback={handleSaveFeedback}
        />
      )}

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}

export default App;
