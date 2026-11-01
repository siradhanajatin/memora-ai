import { GameSession, MemoryCard, Reminder, UserPreferences } from '../types';

const STORAGE_KEYS = {
  SESSIONS: 'memora_game_sessions_v1',
  MEMORY_CARDS: 'memora_memory_cards_v1',
  REMINDERS: 'memora_daily_reminders_v1',
  PREFERENCES: 'memora_user_preferences_v1',
  INITIALIZED: 'memora_db_initialized_v1',
};

// Seed realistic sessions spread over past 3 days
const INITIAL_SESSIONS: GameSession[] = [
  {
    id: 'sess-001',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    gameType: 'picture-matching',
    gameName: 'Picture Matching',
    difficulty: 'easy',
    durationSeconds: 42,
    attempts: 6,
    hintsUsed: 0,
    score: 100,
    maxScore: 100,
    accuracy: 100,
    feedback: 'Comfortable',
    notes: 'Smooth recall, identified floral cards immediately'
  },
  {
    id: 'sess-002',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    gameType: 'object-recognition',
    gameName: 'Object Recognition',
    difficulty: 'easy',
    durationSeconds: 35,
    attempts: 3,
    hintsUsed: 0,
    score: 100,
    maxScore: 100,
    accuracy: 100,
    feedback: 'Too Easy',
    notes: 'Instantly recognized vintage teapot and rotary phone'
  },
  {
    id: 'sess-003',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    gameType: 'sequence-memory',
    gameName: 'Sequence Memory',
    difficulty: 'easy',
    durationSeconds: 54,
    attempts: 4,
    hintsUsed: 1,
    score: 90,
    maxScore: 100,
    accuracy: 90,
    feedback: 'Comfortable',
    notes: 'Used one replay hint on step 3; calm and attentive'
  },
  {
    id: 'sess-004',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    gameType: 'picture-matching',
    gameName: 'Picture Matching',
    difficulty: 'medium',
    durationSeconds: 88,
    attempts: 12,
    hintsUsed: 2,
    score: 80,
    maxScore: 100,
    accuracy: 80,
    feedback: 'Too Difficult',
    notes: 'Showed mild hesitation on 12-card grid; preferred smaller grid'
  },
  {
    id: 'sess-005',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    gameType: 'object-recognition',
    gameName: 'Object Recognition',
    difficulty: 'easy',
    durationSeconds: 32,
    attempts: 3,
    hintsUsed: 0,
    score: 100,
    maxScore: 100,
    accuracy: 100,
    feedback: 'Comfortable',
    notes: 'Joyful smiles when recounting stories about the vintage sewing machine'
  }
];

const INITIAL_MEMORY_CARDS: MemoryCard[] = [
  {
    id: 'card-001',
    name: 'Sarah Jenkins',
    relationship: 'Granddaughter',
    category: 'family',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    notes: 'Sarah loves watercolor painting and brings warm lemon cookies when visiting every Sunday afternoon.',
    dateAdded: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastReviewed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    favorite: true
  },
  {
    id: 'card-002',
    name: 'Cottage by Lake George',
    relationship: 'Family Summer Haven',
    category: 'places',
    imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
    notes: 'Our summer retreat since 1982. We sat on the wooden deck watching loons and enjoying raspberry iced tea.',
    dateAdded: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    lastReviewed: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    favorite: true
  },
  {
    id: 'card-003',
    name: 'Barnaby',
    relationship: 'Loyal Golden Retriever',
    category: 'pets',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    notes: 'Our devoted, gentle golden retriever who loved resting by the armchair and playing catch with yellow tennis balls.',
    dateAdded: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastReviewed: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    favorite: false
  }
];

const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-001',
    title: 'Take Morning Blood Pressure & Heart Medication',
    time: '09:00 AM',
    category: 'medication',
    completed: true,
    completedAt: 'Today at 9:08 AM',
    frequency: 'daily',
    notes: 'Take with half glass of water and light breakfast'
  },
  {
    id: 'rem-002',
    title: 'Morning Hydration: Fresh Lemon Water',
    time: '11:30 AM',
    category: 'hydration',
    completed: true,
    completedAt: 'Today at 11:32 AM',
    frequency: 'daily',
    notes: 'Stay hydrated before lunch'
  },
  {
    id: 'rem-003',
    title: 'Afternoon Garden Walk with Caregiver',
    time: '04:00 PM',
    category: 'activity',
    completed: false,
    frequency: 'daily',
    notes: 'Wear comfortable walking shoes and light sweater'
  },
  {
    id: 'rem-004',
    title: 'Evening Family Video Call with Daughter Emily',
    time: '06:00 PM',
    category: 'social',
    completed: false,
    frequency: 'daily',
    notes: 'Emily will share photos from baby Leo’s park day'
  }
];

const DEFAULT_PREFERENCES: UserPreferences = {
  textSize: 'normal',
  highContrast: false,
  speechEnabled: true,
  soundVolume: 0.6,
};

export class StorageService {
  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (typeof window === 'undefined') return;
    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!initialized) {
      this.resetToSeedData();
    }
  }

  public resetToSeedData() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
    localStorage.setItem(STORAGE_KEYS.MEMORY_CARDS, JSON.stringify(INITIAL_MEMORY_CARDS));
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(INITIAL_REMINDERS));
    if (!localStorage.getItem(STORAGE_KEYS.PREFERENCES)) {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(DEFAULT_PREFERENCES));
    }
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  // --- SESSIONS ---
  public getSessions(): GameSession[] {
    if (typeof window === 'undefined') return INITIAL_SESSIONS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : INITIAL_SESSIONS;
    } catch (e) {
      return INITIAL_SESSIONS;
    }
  }

  public saveSession(session: GameSession): GameSession[] {
    const list = this.getSessions();
    const updated = [session, ...list];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
    }
    return updated;
  }

  // --- MEMORY CARDS ---
  public getMemoryCards(): MemoryCard[] {
    if (typeof window === 'undefined') return INITIAL_MEMORY_CARDS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORY_CARDS);
      return data ? JSON.parse(data) : INITIAL_MEMORY_CARDS;
    } catch (e) {
      return INITIAL_MEMORY_CARDS;
    }
  }

  public saveMemoryCard(card: MemoryCard): MemoryCard[] {
    const list = this.getMemoryCards();
    const existingIndex = list.findIndex(c => c.id === card.id);
    let updated: MemoryCard[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = card;
    } else {
      updated = [card, ...list];
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MEMORY_CARDS, JSON.stringify(updated));
    }
    return updated;
  }

  public deleteMemoryCard(id: string): MemoryCard[] {
    const list = this.getMemoryCards();
    const updated = list.filter(c => c.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MEMORY_CARDS, JSON.stringify(updated));
    }
    return updated;
  }

  public markCardReviewed(id: string) {
    const list = this.getMemoryCards();
    const card = list.find(c => c.id === id);
    if (card) {
      card.lastReviewed = new Date().toISOString();
      this.saveMemoryCard(card);
    }
  }

  // --- REMINDERS ---
  public getReminders(): Reminder[] {
    if (typeof window === 'undefined') return INITIAL_REMINDERS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      return data ? JSON.parse(data) : INITIAL_REMINDERS;
    } catch (e) {
      return INITIAL_REMINDERS;
    }
  }

  public saveReminder(reminder: Reminder): Reminder[] {
    const list = this.getReminders();
    const existingIndex = list.findIndex(r => r.id === reminder.id);
    let updated: Reminder[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = reminder;
    } else {
      updated = [...list, reminder];
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
    }
    return updated;
  }

  public toggleReminder(id: string): { updated: Reminder[]; toggled: Reminder | undefined } {
    const list = this.getReminders();
    let toggled: Reminder | undefined;
    const updated = list.map(r => {
      if (r.id === id) {
        const nextState = !r.completed;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        toggled = {
          ...r,
          completed: nextState,
          completedAt: nextState ? `Today at ${timeStr}` : undefined
        };
        return toggled;
      }
      return r;
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
    }
    return { updated, toggled };
  }

  public deleteReminder(id: string): Reminder[] {
    const list = this.getReminders();
    const updated = list.filter(r => r.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
    }
    return updated;
  }

  // --- PREFERENCES ---
  public getPreferences(): UserPreferences {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data) } : DEFAULT_PREFERENCES;
    } catch (e) {
      return DEFAULT_PREFERENCES;
    }
  }

  public savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    }
    return updated;
  }
}

export const db = new StorageService();
