import React, { useState } from 'react';
import { Student, InterventionRecord } from '../types';

interface InterventionModalProps {
  student: Student | null;
  onClose: () => void;
  onSubmitIntervention: (record: InterventionRecord) => void;
}

export const InterventionModal: React.FC<InterventionModalProps> = ({
  student,
  onClose,
  onSubmitIntervention,
}) => {
  const [type, setType] = useState<InterventionRecord['type']>('Tutoring Session');
  const [targetHours, setTargetHours] = useState('4');
  const [advisorName, setAdvisorName] = useState('Dr. Shanyu Sai');
  const [actionNotes, setActionNotes] = useState(
    'Schedule weekly quantitative problem review to lift baseline study yield by +2 hours.'
  );

  if (!student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: InterventionRecord = {
      id: `INT-${Date.now().toString().slice(-3)}`,
      studentId: student.id,
      studentName: student.name,
      type,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      advisor: advisorName,
      status: 'Active',
      actionSummary: `${actionNotes} (Target Study Allocation: ${targetHours}h/wk)`,
    };
    onSubmitIntervention(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-surface-container-lowest rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-surface-container-high p-6">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">assignment_late</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Trigger Academic Intervention
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-surface-container-low border border-surface-container-high/60 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-on-surface">{student.name}</span>
              <span className="text-outline font-mono ml-2">{student.id}</span>
            </div>
            <span className="font-mono text-error font-semibold">
              Probation Risk: {student.probationRisk}%
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs text-left">
            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Intervention Strategy
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as InterventionRecord['type'])}
                className="w-full p-2.5 bg-surface-container-low rounded-lg border border-surface-container-high text-on-surface text-xs focus:ring-2 focus:ring-secondary/30 outline-none cursor-pointer"
              >
                <option value="Tutoring Session">1-on-1 Guided Problem Tutoring</option>
                <option value="Sleep & Wellness Plan">Sleep Calibration &amp; Wellness Coaching</option>
                <option value="Academic Probation Review">Academic Probation Review &amp; Contract</option>
                <option value="Study Hall Assignment">Mandatory Monitored Study Hall</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-on-surface block mb-1">
                  Target Study Hours / Wk
                </label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={targetHours}
                  onChange={(e) => setTargetHours(e.target.value)}
                  className="w-full p-2 bg-surface-container-low rounded-lg border border-surface-container-high text-on-surface text-xs outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">
                  Assigning Advisor
                </label>
                <input
                  type="text"
                  value={advisorName}
                  onChange={(e) => setAdvisorName(e.target.value)}
                  className="w-full p-2 bg-surface-container-low rounded-lg border border-surface-container-high text-on-surface text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-on-surface block mb-1">
                Field Instructions &amp; Action Notes
              </label>
              <textarea
                rows={3}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="w-full p-2.5 bg-surface-container-low rounded-lg border border-surface-container-high text-on-surface text-xs outline-none resize-none"
              />
            </div>

            <div className="pt-3 border-t border-surface-container-high flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-xs font-semibold text-on-primary shadow-xs cursor-pointer"
              >
                Deploy Intervention Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
