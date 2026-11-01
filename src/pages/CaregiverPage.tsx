import React, { useState } from 'react';
import { 
  Activity, 
  Brain, 
  Clock, 
  CheckCircle2, 
  FileText, 
  RotateCcw, 
  TrendingUp, 
  ShieldAlert, 
  Smile, 
  Sparkles,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { CaregiverOverview, GameSession, Reminder, AIRecommendation } from '../types';
import { AnalyticsCharts } from '../components/Caregiver/AnalyticsCharts';
import { SessionHistoryTable } from '../components/Caregiver/SessionHistoryTable';
import { ClinicalReportModal } from '../components/Caregiver/ClinicalReportModal';
import { sound } from '../services/soundService';

interface Props {
  sessions: GameSession[];
  reminders: Reminder[];
  overview: CaregiverOverview;
  recommendation: AIRecommendation;
  onResetDemoData: () => void;
}

export const CaregiverPage: React.FC<Props> = ({
  sessions,
  reminders,
  overview,
  recommendation,
  onResetDemoData,
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
              Care Partner & Clinician Portal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
            Caregiver Cognitive Analytics
          </h1>
          <p className="text-sm text-stone-500 font-medium">
            Longitudinal engagement tracking, explainable AI audit trails, and clinical visit summaries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => { sound.playClick(); setIsReportModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Consultation Summary Report</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Reset all session logs, reminders, and memory cards to initial realistic demo seed state?")) {
                sound.playClick();
                onResetDemoData();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition active:scale-95 border border-stone-300"
            title="Reset to default seed data"
          >
            <RotateCcw className="w-4 h-4 text-stone-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Mandatory Clinical Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Important Clinical Boundary:</strong>
          <p className="text-amber-900 mt-0.5 leading-relaxed">
            MEMORA AI is a supportive cognitive engagement tool and memory aid. It is not a medical device and does not diagnose, treat, or measure clinical dementia progression. The analytics below reflect participant platform engagement, hint assistance frequency, and self-reported comfort.
          </p>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Cognitive Stability Index */}
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Cognitive Stability
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-800 font-serif">
              {overview.cognitiveStabilityIndex} <span className="text-base font-normal text-stone-400">/ 100</span>
            </div>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              Calculated from recall consistency & autonomous responses
            </p>
          </div>
        </div>

        {/* KPI 2: Total Sessions Completed */}
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Sessions
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-stone-900 font-serif">
              {overview.totalSessions} <span className="text-base font-normal text-stone-400">plays</span>
            </div>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              Active across 3 cognitive domains
            </p>
          </div>
        </div>

        {/* KPI 3: Average Activity Time */}
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Average Pace
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-stone-900 font-serif">
              {overview.averageDurationSeconds}s <span className="text-base font-normal text-stone-400">/ game</span>
            </div>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              Calm, unhurried participation speed
            </p>
          </div>
        </div>

        {/* KPI 4: Reminder Adherence */}
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Reminder Adherence
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-800 font-serif">
              {overview.reminderCompletionRate}%
            </div>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              Daily tasks & medication prompts fulfilled
            </p>
          </div>
        </div>

      </div>

      {/* AI Recommendation Engine Diagnostics Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 rounded-3xl border border-emerald-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-emerald-700" />
          <h3 className="text-lg font-bold text-stone-900 font-serif">
            Current Explainable AI Recommendation Status
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/80 p-4 rounded-2xl border border-emerald-100">
            <span className="text-xs font-bold text-stone-500 uppercase">Target Activity & Difficulty</span>
            <p className="text-lg font-extrabold text-emerald-950 mt-1">
              {recommendation.recommendedGameName} ({recommendation.recommendedDifficulty.toUpperCase()})
            </p>
            <span className="text-xs text-stone-600 mt-1 block">
              Confidence Score: {recommendation.confidenceScore}%
            </span>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl border border-emerald-100 md:col-span-2">
            <span className="text-xs font-bold text-stone-500 uppercase">Clinical Heuristic Decision Rationale</span>
            <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
              {recommendation.clinicalRationale}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Visualizations (Recharts: Line, Bar, Pie) */}
      <AnalyticsCharts sessions={sessions} />

      {/* Recent Session Logs Table */}
      <SessionHistoryTable sessions={sessions} />

      {/* Clinical Report Modal */}
      <ClinicalReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        sessions={sessions}
        overview={overview}
      />

    </div>
  );
};
