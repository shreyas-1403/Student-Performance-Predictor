import React from 'react';
import { Student } from '../types';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onTriggerIntervention: (student: Student) => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  students,
  onSelectStudent,
  onTriggerIntervention,
}) => {
  if (!isOpen) return null;

  const flaggedStudents = students.filter((s) => s.interventionFlag || s.status === 'Critical Support');

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed top-16 right-4 sm:right-24 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high z-50 p-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-xl">crisis_alert</span>
            <h4 className="font-headline-sm text-sm font-bold text-on-surface">
              Flagged for Intervention ({flaggedStudents.length})
            </h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <div className="mt-2 space-y-2 max-h-80 overflow-y-auto pr-1">
          {flaggedStudents.map((st) => (
            <div
              key={st.id}
              className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col justify-between hover:bg-surface-container transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div
                    onClick={() => {
                      onSelectStudent(st);
                      onClose();
                    }}
                    className="font-bold text-xs text-on-surface hover:underline cursor-pointer"
                  >
                    {st.name}
                  </div>
                  <span className="text-[10px] text-outline font-mono">{st.id} · {st.cohort}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-bold">
                  {st.probationRisk}% Risk
                </span>
              </div>

              <div className="mt-2 text-[11px] text-on-surface-variant flex justify-between items-center">
                <span>{st.hoursStudied}h study · Prev: {st.previousScore}</span>
                <button
                  onClick={() => {
                    onTriggerIntervention(st);
                    onClose();
                  }}
                  className="px-2 py-1 rounded bg-error text-white font-semibold text-[10px] hover:bg-error/90 cursor-pointer"
                >
                  Intervene
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
