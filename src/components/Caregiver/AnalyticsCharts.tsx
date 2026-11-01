import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { GameSession } from '../../types';

interface Props {
  sessions: GameSession[];
}

export const AnalyticsCharts: React.FC<Props> = ({ sessions }) => {
  // 1. Line Chart Data: Weekly Cognitive Activity & Engagement Trends
  // Format past 7 days
  const last7Days: { dateStr: string; label: string; sessions: number; avgAccuracy: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' });

    const daySessions = sessions.filter(s => s.timestamp.startsWith(dateStr));
    const count = daySessions.length;
    const avgAcc = count > 0 ? Math.round(daySessions.reduce((sum, s) => sum + s.accuracy, 0) / count) : 0;

    last7Days.push({
      dateStr,
      label,
      sessions: count,
      avgAccuracy: avgAcc,
    });
  }

  // 2. Bar Chart Data: Game Type & Difficulty Breakdown
  const gameStats = [
    {
      name: 'Picture Matching',
      easy: sessions.filter(s => s.gameType === 'picture-matching' && s.difficulty === 'easy').length,
      medium: sessions.filter(s => s.gameType === 'picture-matching' && s.difficulty === 'medium').length,
      hard: sessions.filter(s => s.gameType === 'picture-matching' && s.difficulty === 'hard').length,
    },
    {
      name: 'Sequence Memory',
      easy: sessions.filter(s => s.gameType === 'sequence-memory' && s.difficulty === 'easy').length,
      medium: sessions.filter(s => s.gameType === 'sequence-memory' && s.difficulty === 'medium').length,
      hard: sessions.filter(s => s.gameType === 'sequence-memory' && s.difficulty === 'hard').length,
    },
    {
      name: 'Object Recognition',
      easy: sessions.filter(s => s.gameType === 'object-recognition' && s.difficulty === 'easy').length,
      medium: sessions.filter(s => s.gameType === 'object-recognition' && s.difficulty === 'medium').length,
      hard: sessions.filter(s => s.gameType === 'object-recognition' && s.difficulty === 'hard').length,
    },
  ];

  // 3. Pie Chart Data: Self-Reported Comfort Distribution
  const comfortCounts: Record<string, number> = {
    'Comfortable': 0,
    'Too Easy': 0,
    'Too Difficult': 0,
    'I Want a Break': 0,
  };
  sessions.forEach(s => {
    if (comfortCounts[s.feedback] !== undefined) {
      comfortCounts[s.feedback]++;
    }
  });

  const pieData = [
    { name: 'Comfortable', value: comfortCounts['Comfortable'] || 0, color: '#3F7D58' },
    { name: 'Too Easy', value: comfortCounts['Too Easy'] || 0, color: '#F59E0B' },
    { name: 'Too Difficult', value: comfortCounts['Too Difficult'] || 0, color: '#F43F5E' },
    { name: 'I Want a Break', value: comfortCounts['I Want a Break'] || 0, color: '#8B5CF6' },
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
      
      {/* 1. Line Chart: Weekly Cognitive Activity & Accuracy */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mb-1">
            Engagement Velocity
          </span>
          <h4 className="text-lg font-bold text-stone-900 font-serif">
            7-Day Cognitive Activity & Accuracy Trends
          </h4>
          <p className="text-xs text-stone-500">
            Sessions completed per day and average recall accuracy (%).
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sessions"
                name="Sessions Completed"
                stroke="#3F7D58"
                strokeWidth={3}
                dot={{ r: 4, fill: '#3F7D58' }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgAccuracy"
                name="Accuracy (%)"
                stroke="#EE8E32"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#EE8E32' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Bar Chart: Game Types by Difficulty */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mb-1">
            Cognitive Domain Distribution
          </span>
          <h4 className="text-lg font-bold text-stone-900 font-serif">
            Game Completion & Difficulty Breakdown
          </h4>
          <p className="text-xs text-stone-500">
            Total completed plays divided across Easy, Medium, and Hard tiers.
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gameStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar dataKey="easy" name="Easy" fill="#3F7D58" radius={[4, 4, 0, 0]} />
              <Bar dataKey="medium" name="Medium" fill="#EE8E32" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hard" name="Hard" fill="#6BA2BC" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Pie Chart: Comfort Distribution */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-sm lg:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-md">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mb-1">
            Affective Well-Being
          </span>
          <h4 className="text-lg font-bold text-stone-900 font-serif">
            Self-Reported Experience & Comfort Rates
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
            The XAI Recommendation Engine monitors this affective metric to ensure the participant remains in a positive flow state (optimal challenge without stress or cognitive fatigue).
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              🟢 Comfortable: {comfortCounts['Comfortable']}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              🟡 Too Easy: {comfortCounts['Too Easy']}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
              🔴 Too Difficult: {comfortCounts['Too Difficult']}
            </span>
          </div>
        </div>

        <div className="h-56 w-full sm:w-72 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
