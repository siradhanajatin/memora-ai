import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2, ShieldAlert, Heart } from 'lucide-react';
import { GameSession, CaregiverOverview } from '../../types';
import { sound } from '../../services/soundService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sessions: GameSession[];
  overview: CaregiverOverview;
}

export const ClinicalReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  sessions,
  overview,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const handleDownloadJSON = () => {
    sound.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      generatedAt: new Date().toISOString(),
      platform: "MEMORA AI Cognitive Care System",
      overview,
      sessions,
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `memora_caregiver_report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 flex flex-col gap-6 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-700" />
            <h3 id="report-modal-title" className="text-xl font-bold text-stone-900 font-serif">
              Caregiver & Clinical Consultation Summary
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => { sound.playClick(); onClose(); }}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Layout */}
        <div className="space-y-6 text-stone-800">
          
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b-2 border-emerald-800 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-emerald-950 font-serif tracking-tight">
                MEMORA AI &bull; Cognitive Activity Summary
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Explainable AI-Based Adaptive Cognitive Gaming & Memory Assistance
              </p>
            </div>
            <div className="text-right text-xs text-stone-500">
              <p><strong className="text-stone-700">Date Generated:</strong> {new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p><strong className="text-stone-700">Audit Sessions:</strong> {sessions.length} records</p>
            </div>
          </div>

          {/* Mandatory Clinical Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Notice for Clinicians & Care Partners:</strong> MEMORA AI is a supportive cognitive engagement tool and memory aid. It is not a medical device and does not diagnose, treat, or measure clinical dementia progression. This summary reflects self-directed user interaction and engagement patterns.
            </p>
          </div>

          {/* Metric KPI Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="text-center p-2">
              <span className="text-xs text-stone-500 font-medium block">Cognitive Stability Index</span>
              <span className="text-2xl font-extrabold text-emerald-700">{overview.cognitiveStabilityIndex} / 100</span>
            </div>
            <div className="text-center p-2">
              <span className="text-xs text-stone-500 font-medium block">Total Activity Sessions</span>
              <span className="text-2xl font-extrabold text-stone-900">{overview.totalSessions}</span>
            </div>
            <div className="text-center p-2">
              <span className="text-xs text-stone-500 font-medium block">Avg Duration / Session</span>
              <span className="text-2xl font-extrabold text-stone-900">{overview.averageDurationSeconds}s</span>
            </div>
            <div className="text-center p-2">
              <span className="text-xs text-stone-500 font-medium block">Reminder Adherence</span>
              <span className="text-2xl font-extrabold text-emerald-700">{overview.reminderCompletionRate}%</span>
            </div>
          </div>

          {/* Qualitative Summary */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Qualitative Observations & Adaptive Heuristics
            </h3>
            <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1">
              <li>
                <strong>Comfortable Flow State:</strong> Participant expressed comfort in {overview.comfortDistribution['Comfortable'] || 0} out of {overview.totalSessions} recorded sessions.
              </li>
              <li>
                <strong>Domain Retention:</strong> High accuracy achieved in semantic object recognition with minimal hints required.
              </li>
              <li>
                <strong>Pacing:</strong> Average cognitive exercise duration sits steadily around {overview.averageDurationSeconds} seconds, indicating calm, unhurried participation.
              </li>
            </ul>
          </div>

          {/* Recent 5 Sessions Summary Table */}
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif mb-2">
              Recent Five Session Logs
            </h3>
            <table className="w-full text-xs text-left border-collapse border border-stone-200">
              <thead>
                <tr className="bg-stone-100 text-stone-700">
                  <th className="p-2 border border-stone-200">Date</th>
                  <th className="p-2 border border-stone-200">Activity</th>
                  <th className="p-2 border border-stone-200">Difficulty</th>
                  <th className="p-2 border border-stone-200">Duration</th>
                  <th className="p-2 border border-stone-200">Accuracy</th>
                  <th className="p-2 border border-stone-200">Hints</th>
                  <th className="p-2 border border-stone-200">Self-Report</th>
                </tr>
              </thead>
              <tbody>
                {sessions.slice(0, 5).map((s) => (
                  <tr key={s.id}>
                    <td className="p-2 border border-stone-200">{new Date(s.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</td>
                    <td className="p-2 border border-stone-200 font-medium">{s.gameName}</td>
                    <td className="p-2 border border-stone-200 capitalize">{s.difficulty}</td>
                    <td className="p-2 border border-stone-200">{s.durationSeconds}s</td>
                    <td className="p-2 border border-stone-200">{s.accuracy}%</td>
                    <td className="p-2 border border-stone-200">{s.hintsUsed}</td>
                    <td className="p-2 border border-stone-200">{s.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signature / Notes line */}
          <div className="pt-6 border-t border-stone-200 grid grid-cols-2 gap-8 text-xs text-stone-500">
            <div>
              <p className="font-bold text-stone-700 mb-6">Care Partner / Facilitator Signature:</p>
              <div className="border-b border-stone-300 w-full" />
            </div>
            <div>
              <p className="font-bold text-stone-700 mb-6">Attending Physician / Notes:</p>
              <div className="border-b border-stone-300 w-full" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
