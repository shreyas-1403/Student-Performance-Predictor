import React from 'react';
import { Student } from '../types';

interface StudentDetailDrawerProps {
  student: Student | null;
  onClose: () => void;
  onTriggerIntervention: (student: Student) => void;
}

export const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({
  student,
  onClose,
  onTriggerIntervention,
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container-lowest shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-surface-container-high">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm">
                  {student.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    {student.name}
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-mono text-outline">
                    <span>{student.id}</span>
                    <span>•</span>
                    <span>{student.cohort}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Scoreboard Overview */}
            <div className="my-5 p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <span className="text-[11px] font-semibold text-outline uppercase">Empirical Score</span>
                  <div className="font-data-metric text-2xl font-bold text-on-surface mt-0.5">
                    {student.actualScore.toFixed(1)}
                  </div>
                </div>
                <div className="border-l border-surface-container-high">
                  <span className="text-[11px] font-semibold text-primary uppercase">Ridge Prediction</span>
                  <div className="font-data-metric text-2xl font-bold text-primary mt-0.5">
                    {student.predictedScore.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-surface-container-high flex justify-between items-center text-xs font-mono">
                <span className="text-outline">Residual (y - t):</span>
                <span className={`font-bold ${student.residual >= 0 ? 'text-tertiary-container' : 'text-secondary'}`}>
                  {student.residual >= 0 ? `+${student.residual.toFixed(1)}` : student.residual.toFixed(1)} pts
                </span>
              </div>
            </div>

            {/* Bayesian Risk Pill */}
            <div className="mb-5 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-secondary">analytics</span>
                <span className="text-xs font-semibold text-on-surface">Posterior Probation Risk</span>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                student.probationRisk >= 50
                  ? 'bg-error-container text-on-error-container'
                  : 'bg-surface-container text-primary'
              }`}>
                {student.probationRisk}%
              </span>
            </div>

            {/* Input Feature Breakdown */}
            <div className="space-y-3">
              <h4 className="font-label-sm text-xs uppercase text-outline font-semibold tracking-wider">
                Behavioral Variables
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container-high/40">
                  <span className="text-outline">Study Allocation</span>
                  <div className="font-bold text-sm text-primary mt-0.5">{student.hoursStudied} hrs/wk</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container-high/40">
                  <span className="text-outline">Previous Score</span>
                  <div className="font-bold text-sm text-primary mt-0.5">{student.previousScore} / 100</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container-high/40">
                  <span className="text-outline">Sleep Duration</span>
                  <div className="font-bold text-sm text-primary mt-0.5">{student.sleepHours} hrs/night</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container-high/40">
                  <span className="text-outline">Practice Papers</span>
                  <div className="font-bold text-sm text-primary mt-0.5">{student.papersPracticed} mock papers</div>
                </div>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container-high/40 text-xs">
                <span className="text-outline">Extracurricular Status</span>
                <div className="font-bold text-sm text-on-surface mt-0.5">
                  {student.extracurricular ? 'Active Participant (BF₁₀ = 3.24)' : 'Inactive'}
                </div>
              </div>
            </div>

            {/* Advisor Notes */}
            {student.notes && (
              <div className="mt-5 p-3.5 bg-surface-container-low rounded-lg border border-surface-container-high/40 text-xs">
                <span className="font-semibold text-on-surface">Advisor Field Telemetry Notes:</span>
                <p className="text-on-surface-variant mt-1 leading-relaxed">{student.notes}</p>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="pt-6 border-t border-surface-container-high mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onTriggerIntervention(student);
                onClose();
              }}
              className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-container text-xs font-semibold text-on-primary transition-colors cursor-pointer"
            >
              Trigger Intervention
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
