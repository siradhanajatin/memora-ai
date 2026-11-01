import React, { useState } from 'react';
import { X, Clock, CheckCircle2, Pill, Activity, Coffee, Users, Utensils } from 'lucide-react';
import { Reminder, ReminderCategory } from '../../types';
import { sound } from '../../services/soundService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddReminder: (reminder: Reminder) => void;
}

export const AddReminderModal: React.FC<Props> = ({ isOpen, onClose, onAddReminder }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00 AM');
  const [category, setCategory] = useState<ReminderCategory>('medication');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playReminderDone();
    const newReminder: Reminder = {
      id: `rem-${Date.now()}`,
      title: title.trim(),
      time,
      category,
      completed: false,
      frequency: 'daily',
      notes: notes.trim() || undefined,
    };

    onAddReminder(newReminder);
    onClose();
  };

  const categories: { id: ReminderCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'medication', label: 'Medication', icon: <Pill className="w-4 h-4 text-rose-500" /> },
    { id: 'hydration', label: 'Hydration', icon: <Coffee className="w-4 h-4 text-sky-500" /> },
    { id: 'activity', label: 'Physical Activity', icon: <Activity className="w-4 h-4 text-emerald-500" /> },
    { id: 'social', label: 'Social & Family', icon: <Users className="w-4 h-4 text-purple-500" /> },
    { id: 'nutrition', label: 'Meals & Snacks', icon: <Utensils className="w-4 h-4 text-amber-500" /> },
  ];

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-reminder-title"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-100 flex flex-col gap-5">
        
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Clock className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 id="add-reminder-title" className="text-xl font-extrabold text-stone-900 font-serif">
                Add Daily Reminder
              </h3>
              <p className="text-xs text-stone-500">Set a gentle prompt for medication, hydration, or walks</p>
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
              Reminder Description *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning blood pressure tablet, Drink lemon water"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-stone-800 mb-1">
                Time of Day
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., 09:00 AM"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base font-semibold"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-800 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReminderCategory)}
                className="w-full px-3 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-800 mb-1">
              Gentle Notes / Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., 'Take with light breakfast and half glass of warm water...'"
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
              Save Reminder
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
