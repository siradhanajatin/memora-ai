import React, { useState } from 'react';
import { X, Image as ImageIcon, Heart, Sparkles } from 'lucide-react';
import { MemoryCard, MemoryCategory } from '../../types';
import { sound } from '../../services/soundService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: MemoryCard) => void;
}

const PRESET_IMAGES = [
  { label: 'Family Member', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80' },
  { label: 'Grandchild', url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80' },
  { label: 'Lake Cottage', url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cozy Garden', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80' },
  { label: 'Friendly Pet', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Wedding Day', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80' },
];

export const AddMemoryCardModal: React.FC<Props> = ({ isOpen, onClose, onAddCard }) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('family');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sound.playMatchSuccess();
    const newCard: MemoryCard = {
      id: `card-${Date.now()}`,
      name: name.trim(),
      relationship: relationship.trim() || 'Loved One',
      category,
      imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
      notes: notes.trim() || 'A cherished personal memory.',
      dateAdded: new Date().toISOString(),
      favorite: true,
    };

    onAddCard(newCard);
    onClose();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-card-title"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-100 flex flex-col gap-5">
        
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-emerald-600" />
            </div>
            <div>
              <h3 id="add-card-title" className="text-xl font-extrabold text-stone-900 font-serif">
                Add New Memory Card
              </h3>
              <p className="text-xs text-stone-500">Record a loved person, special place, or sweet pet</p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-stone-800 mb-1">
              Name or Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Granddaughter Sarah, Lake George Cabin, Barnaby"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-stone-800 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MemoryCategory)}
                className="w-full px-3 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold bg-white"
              >
                <option value="family">Family & Friends</option>
                <option value="places">Favorite Places</option>
                <option value="pets">Beloved Pets</option>
                <option value="milestones">Milestones & Life</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-800 mb-1">
                Relationship / Tag
              </label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Granddaughter, Family Dog"
                className="w-full px-3 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-800 mb-1">
              Select a Photo Preset or Enter Image URL
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`h-16 rounded-xl overflow-hidden border-2 relative transition ${
                    imageUrl === preset.url ? 'border-emerald-600 ring-2 ring-emerald-400' : 'border-stone-200 opacity-70'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-stone-900/60 text-[10px] text-white font-medium truncate px-1 py-0.5 text-center">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste external image URL..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 text-stone-600"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-800 mb-1">
              Special Memories & Stories
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What makes this person or place special? (e.g., 'Brings fresh lemon cookies every Sunday and loves watercolor painting...')"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { sound.playClick(); onClose(); }}
              className="px-5 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-700 hover:bg-stone-100 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition"
            >
              Save Memory Card
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
