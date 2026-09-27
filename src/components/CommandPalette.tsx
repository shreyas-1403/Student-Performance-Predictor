import React, { useState, useEffect } from 'react';
import { NavTab } from './Sidebar';
import { Student } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenReportModal: () => void;
  onOpenExportModal: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  students,
  onSelectStudent,
  onOpenReportModal,
  onOpenExportModal,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for ⌘K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedStudents = students.filter(
    (s) =>
      s.id.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.email.toLowerCase().includes(query.toLowerCase())
  );

  const navActions: { id: NavTab; label: string; icon: string }[] = [
    { id: 'overview-predictions', label: 'Go to Overview & Predictions', icon: 'insights' },
    { id: 'interactive-what-if-simulator', label: 'Go to What-If Simulator', icon: 'tune' },
    { id: 'feature-importance-insights', label: 'Go to Feature Insights', icon: 'auto_graph' },
    { id: 'student-roster-interventions', label: 'Go to Student Roster & Interventions', icon: 'group_work' },
  ];

  const matchedActions = navActions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-20 px-4 pb-20 text-center">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <div className="inline-block bg-surface-container-lowest rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all max-w-xl w-full border border-surface-container-high relative z-10">
          {/* Search bar */}
          <div className="p-4 border-b border-surface-container-high flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-xl">search</span>
            <input
              autoFocus
              type="text"
              placeholder="Search students, commands, or jump to view..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent font-body-sm text-sm text-on-surface focus:outline-none placeholder:text-outline"
            />
            <span className="text-[10px] font-mono text-outline px-1.5 py-0.5 rounded bg-surface-container-high">
              ESC
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
            {/* Quick Actions */}
            <div>
              <div className="px-2 pb-1 text-[10px] font-bold text-outline uppercase tracking-wider">
                Quick Actions
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onOpenReportModal();
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2.5 text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary text-base">functions</span>
                  <span>Generate Formal Mathematical Report</span>
                </button>
                <button
                  onClick={() => {
                    onOpenExportModal();
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2.5 text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary text-base">download</span>
                  <span>Export Model Weights (JSON, NumPy, LaTeX, R)</span>
                </button>
              </div>
            </div>

            {/* Navigation links */}
            {matchedActions.length > 0 && (
              <div>
                <div className="px-2 pb-1 text-[10px] font-bold text-outline uppercase tracking-wider">
                  Navigation
                </div>
                <div className="space-y-1">
                  {matchedActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => {
                        onSelectTab(action.id);
                        onClose();
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2.5 text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-secondary text-base">
                        {action.icon}
                      </span>
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Students */}
            {matchedStudents.length > 0 && (
              <div>
                <div className="px-2 pb-1 text-[10px] font-bold text-outline uppercase tracking-wider">
                  Students ({matchedStudents.length})
                </div>
                <div className="space-y-1">
                  {matchedStudents.slice(0, 5).map((st) => (
                    <div
                      key={st.id}
                      onClick={() => {
                        onSelectStudent(st);
                        onClose();
                      }}
                      className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-primary font-bold">{st.id}</span>
                        <span>{st.name}</span>
                        <span className="text-outline text-[11px]">({st.cohort})</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-secondary">
                        {st.predictedScore.toFixed(1)} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
