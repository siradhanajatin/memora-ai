import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Clock, 
  HelpCircle, 
  Smile, 
  Frown, 
  Sparkles, 
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { GameSession, DifficultyLevel, UserFeedback } from '../../types';

interface Props {
  sessions: GameSession[];
}

export const SessionHistoryTable: React.FC<Props> = ({ sessions }) => {
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterGame, setFilterGame] = useState<string>('all');

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.gameName.toLowerCase().includes(search.toLowerCase()) ||
                          (session.notes && session.notes.toLowerCase().includes(search.toLowerCase())) ||
                          session.feedback.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = filterDifficulty === 'all' || session.difficulty === filterDifficulty;
    const matchesGame = filterGame === 'all' || session.gameType === filterGame;
    return matchesSearch && matchesDiff && matchesGame;
  });

  const getFeedbackBadge = (feedback: UserFeedback) => {
    switch (feedback) {
      case 'Comfortable':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Smile className="w-3.5 h-3.5 text-emerald-600" />
            Comfortable
          </span>
        );
      case 'Too Easy':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Too Easy
          </span>
        );
      case 'Too Difficult':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <Frown className="w-3.5 h-3.5 text-rose-600" />
            Too Difficult
          </span>
        );
      case 'I Want a Break':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <Coffee className="w-3.5 h-3.5 text-purple-600" />
            Break Requested
          </span>
        );
    }
  };

  const getDifficultyBadge = (difficulty: DifficultyLevel) => {
    const colors = {
      easy: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      medium: 'bg-amber-50 text-amber-800 border-amber-200',
      hard: 'bg-rose-50 text-rose-800 border-rose-200',
    }[difficulty];

    return (
      <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase border ${colors}`}>
        {difficulty}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-6 my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Audit Logs & Performance
            </span>
          </div>
          <h4 className="text-xl font-bold text-stone-900 font-serif">
            Recent Activity Session Logs
          </h4>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter logs..."
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50"
            />
          </div>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-white font-medium text-stone-700"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={filterGame}
            onChange={(e) => setFilterGame(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-white font-medium text-stone-700"
          >
            <option value="all">All Games</option>
            <option value="picture-matching">Picture Matching</option>
            <option value="sequence-memory">Sequence Memory</option>
            <option value="object-recognition">Object Recognition</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold text-xs uppercase tracking-wider">
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Game</th>
              <th className="py-3 px-4">Difficulty</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Accuracy / Score</th>
              <th className="py-3 px-4">Hints</th>
              <th className="py-3 px-4">Comfort Feedback</th>
              <th className="py-3 px-4">Clinical Observations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-stone-400">
                  No session logs match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredSessions.map((session) => {
                const dateObj = new Date(session.timestamp);
                const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
                const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <tr key={session.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-4 whitespace-nowrap text-stone-600 text-xs">
                      <span className="font-bold text-stone-800 block">{dateStr}</span>
                      <span className="text-stone-400">{timeStr}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900 whitespace-nowrap">
                      {session.gameName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getDifficultyBadge(session.difficulty)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-stone-700 font-medium">
                      {session.durationSeconds}s
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <span>{session.accuracy}%</span>
                        <div className="w-12 h-1.5 bg-stone-200 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${session.accuracy}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-stone-700">
                      {session.hintsUsed}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getFeedbackBadge(session.feedback)}
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-600 max-w-xs truncate">
                      {session.notes || 'Routine cognitive engagement session completed.'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
