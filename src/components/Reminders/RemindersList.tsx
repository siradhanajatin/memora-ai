import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Volume2, 
  Trash2, 
  Pill, 
  Activity, 
  Coffee, 
  Users, 
  Utensils, 
  Calendar,
  Sparkles,
  Check
} from 'lucide-react';
import { Reminder, ReminderCategory } from '../../types';
import { sound } from '../../services/soundService';
import { speech } from '../../services/speechService';
import { AddReminderModal } from './AddReminderModal';

interface Props {
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: Reminder) => void;
  onDeleteReminder: (id: string) => void;
}

export const RemindersList: React.FC<Props> = ({
  reminders,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | ReminderCategory>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const completedCount = reminders.filter(r => r.completed).length;
  const pendingCount = reminders.length - completedCount;
  const completionPercentage = reminders.length > 0 ? Math.round((completedCount / reminders.length) * 100) : 0;

  const filteredReminders = reminders.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !r.completed;
    if (filter === 'completed') return r.completed;
    return r.category === filter;
  });

  const handleToggle = (reminder: Reminder) => {
    sound.playReminderDone();
    onToggleReminder(reminder.id);
    if (!reminder.completed) {
      speech.speak(`Well done! Marked ${reminder.title} as completed.`);
    }
  };

  const handleSpeak = (reminder: Reminder) => {
    sound.playClick();
    const narration = `Reminder for ${reminder.time}: ${reminder.title}. ${reminder.notes || ''}`;
    speech.speak(narration);
  };

  const getCategoryIcon = (cat: ReminderCategory) => {
    switch (cat) {
      case 'medication':
        return <Pill className="w-5 h-5 text-rose-500" />;
      case 'hydration':
        return <Coffee className="w-5 h-5 text-sky-500" />;
      case 'activity':
        return <Activity className="w-5 h-5 text-emerald-500" />;
      case 'social':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'nutrition':
        return <Utensils className="w-5 h-5 text-amber-500" />;
    }
  };

  const getCategoryColor = (cat: ReminderCategory) => {
    switch (cat) {
      case 'medication':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'hydration':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'activity':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'social':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'nutrition':
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mb-1">
            Gentle Daily Support
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            Daily Reminders & Wellness
          </h2>
          <p className="text-sm text-stone-500 font-medium">
            Clear, comforting prompts for medications, hydration, and daily activities.
          </p>
        </div>

        <button
          onClick={() => { sound.playClick(); setIsAddModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Progress & Wellness Summary Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
            {completionPercentage}%
          </div>
          <div>
            <h4 className="text-lg font-extrabold text-emerald-950 font-serif">
              Today's Care Rhythm
            </h4>
            <p className="text-xs sm:text-sm text-emerald-800 font-medium mt-0.5">
              {completedCount} of {reminders.length} tasks completed &bull; {pendingCount} upcoming
            </p>
          </div>
        </div>

        <div className="w-full sm:w-48 bg-white/80 p-1.5 rounded-2xl border border-emerald-200">
          <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {[
          { id: 'all', label: `All (${reminders.length})` },
          { id: 'pending', label: `Upcoming (${pendingCount})` },
          { id: 'completed', label: `Completed (${completedCount})` },
          { id: 'medication', label: 'Medications' },
          { id: 'activity', label: 'Activities' },
          { id: 'hydration', label: 'Hydration' },
        ].map((tab) => {
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { sound.playClick(); setFilter(tab.id as typeof filter); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                active 
                  ? 'bg-emerald-700 text-white shadow-sm' 
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Reminders List */}
      <div className="flex flex-col gap-3">
        {filteredReminders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center text-stone-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
            <p className="font-bold text-stone-800">No Reminders in this View</p>
            <p className="text-xs text-stone-500 mt-1">All tasks in this category are completed or none have been added yet.</p>
          </div>
        ) : (
          filteredReminders.map((reminder) => {
            return (
              <div
                key={reminder.id}
                className={`rounded-2xl border-2 p-4 sm:p-5 transition-all flex items-start justify-between gap-4 ${
                  reminder.completed
                    ? 'bg-stone-50/90 border-stone-200 opacity-75'
                    : 'bg-white border-stone-200/90 hover:border-emerald-300 shadow-sm'
                }`}
              >
                {/* Large Toggle Checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggle(reminder)}
                  aria-label={reminder.completed ? `Mark ${reminder.title} incomplete` : `Mark ${reminder.title} complete`}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition active:scale-90 mt-0.5 border-2 ${
                    reminder.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'bg-white border-stone-300 hover:border-emerald-500 text-transparent'
                  }`}
                >
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                </button>

                {/* Reminder Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getCategoryColor(reminder.category)}`}>
                      {getCategoryIcon(reminder.category)}
                      <span className="capitalize">{reminder.category}</span>
                    </span>

                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      <Clock className="w-3.5 h-3.5" />
                      {reminder.time}
                    </span>
                  </div>

                  <h4 className={`text-base sm:text-lg font-bold text-stone-900 ${
                    reminder.completed ? 'line-through text-stone-500' : ''
                  }`}>
                    {reminder.title}
                  </h4>

                  {reminder.notes && (
                    <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                      {reminder.notes}
                    </p>
                  )}

                  {reminder.completed && reminder.completedAt && (
                    <p className="text-[11px] font-semibold text-emerald-700 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed: {reminder.completedAt}
                    </p>
                  )}
                </div>

                {/* Action buttons (Speak & Delete) */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleSpeak(reminder)}
                    className="p-2 rounded-xl text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                    title="Read reminder aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => { sound.playClick(); onDeleteReminder(reminder.id); }}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Reminder Modal */}
      <AddReminderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddReminder={onAddReminder}
      />
    </div>
  );
};
