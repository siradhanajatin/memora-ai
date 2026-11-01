import React, { useState } from 'react';
import { 
  Heart, 
  Volume2, 
  Plus, 
  Search, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Check, 
  Trash2,
  Calendar,
  RotateCw
} from 'lucide-react';
import { MemoryCard, MemoryCategory } from '../../types';
import { sound } from '../../services/soundService';
import { speech } from '../../services/speechService';
import { AddMemoryCardModal } from './AddMemoryCardModal';

interface Props {
  cards: MemoryCard[];
  onAddCard: (card: MemoryCard) => void;
  onDeleteCard: (id: string) => void;
  onReviewedCard: (id: string) => void;
}

export const MemoryCardsList: React.FC<Props> = ({
  cards,
  onAddCard,
  onDeleteCard,
  onReviewedCard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [revealedQuizCards, setRevealedQuizCards] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Memories' },
    { id: 'family', label: 'Family & Friends' },
    { id: 'places', label: 'Favorite Places' },
    { id: 'pets', label: 'Pets' },
    { id: 'milestones', label: 'Milestones' },
  ];

  const filteredCards = cards.filter(card => {
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    const matchesQuery = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.relationship.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleSpeakCard = (card: MemoryCard) => {
    sound.playClick();
    const text = `This is ${card.name}, ${card.relationship}. ${card.notes}`;
    speech.speak(text);
    onReviewedCard(card.id);
  };

  const handleToggleQuizReveal = (cardId: string) => {
    sound.playClick();
    setRevealedQuizCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
    onReviewedCard(cardId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Personal Reminiscence
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            Memory Cards
          </h2>
          <p className="text-sm text-stone-500 font-medium">
            Treasured photos and memories of beloved family, places, and pets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quiz Mode Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setIsQuizMode(!isQuizMode);
              setRevealedQuizCards({});
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition border ${
              isQuizMode 
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400' 
                : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>{isQuizMode ? 'Exit Practice Mode' : 'Memory Practice Mode'}</span>
          </button>

          {/* Add Card Button */}
          <button
            onClick={() => { sound.playClick(); setIsAddModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory Card</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-white p-3 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { sound.playClick(); setSelectedCategory(cat.id); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                  active 
                    ? 'bg-emerald-700 text-white shadow-sm' 
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="relative flex-shrink-0 sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50"
          />
        </div>
      </div>

      {/* Practice Mode Gentle Banner */}
      {isQuizMode && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-950 flex items-center justify-between gap-3 animate-in fade-in">
          <div>
            <p className="font-bold text-sm sm:text-base">
              🧠 Memory Practice Mode Active
            </p>
            <p className="text-xs sm:text-sm text-amber-900 mt-0.5">
              Names and details are hidden. Look at each picture, see if you recognize it, then tap to reveal!
            </p>
          </div>
          <button
            onClick={() => speech.speak("Look at each photo and try to remember who or what it is. Tap the card when you want to see the answer.")}
            className="p-2 rounded-xl bg-white border border-amber-300 text-amber-800 flex-shrink-0"
            title="Listen to instructions"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Card Grid */}
      {filteredCards.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto my-8">
          <Layers className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-800">No Memory Cards Found</h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 mb-4">
            Try adjusting your search or add a cherished memory card for this collection.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-sm"
          >
            Add Memory Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => {
            const isRevealed = !isQuizMode || revealedQuizCards[card.id];

            return (
              <div
                key={card.id}
                className="bg-white rounded-3xl border-2 border-stone-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Photo container */}
                <div className="h-56 sm:h-64 relative bg-stone-100 overflow-hidden">
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-emerald-800 border border-stone-200 shadow-sm capitalize">
                    {card.category}
                  </div>

                  {/* Speak button overlay */}
                  {isRevealed && (
                    <button
                      onClick={() => handleSpeakCard(card)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur text-emerald-700 hover:bg-emerald-50 border border-stone-200 flex items-center justify-center shadow-md transition active:scale-90"
                      title="Read details aloud"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Content body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  {isRevealed ? (
                    <div>
                      <div className="mb-2">
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                          {card.relationship}
                        </span>
                        <h4 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif">
                          {card.name}
                        </h4>
                      </div>

                      <p className="text-stone-700 text-sm font-medium leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-100 mb-4">
                        {card.notes}
                      </p>
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-base font-extrabold text-stone-800 mb-1">
                        Who or what is this?
                      </p>
                      <p className="text-xs text-stone-500 mb-4">
                        Take a moment to recall before looking.
                      </p>
                      <button
                        onClick={() => handleToggleQuizReveal(card.id)}
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow transition active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Tap to Reveal Details</span>
                      </button>
                    </div>
                  )}

                  {/* Bottom Footer info */}
                  {isRevealed && (
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Added {new Date(card.dateAdded).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { sound.playClick(); onDeleteCard(card.id); }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Card Modal */}
      <AddMemoryCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCard={onAddCard}
      />
    </div>
  );
};
