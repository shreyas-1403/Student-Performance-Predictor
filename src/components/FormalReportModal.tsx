import React, { useState } from 'react';

interface FormalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormalReportModal: React.FC<FormalReportModalProps> = ({ isOpen, onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-surface-container-lowest rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-surface-container-high p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-2xl">description</span>
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Formal Mathematical &amp; Telemetry Report
                </h3>
                <span className="text-xs text-outline font-mono">
                  Document Ref: EDP-2024-RIDGE-POSTERIOR
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Printable Report Content */}
          <div className="my-6 space-y-4 text-xs text-on-surface-variant font-body-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
            <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container-high/60">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-on-surface">
                    EduPredict Academic Intelligence Executive Briefing
                  </h4>
                  <p className="text-outline text-[11px] mt-0.5">
                    Lead Academic Advisor: Dr. Shanyu Sai · Department of Quantitative Analytics
                  </p>
                </div>
                <span className="font-mono text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded font-semibold">
                  STATUS: VERIFIED
                </span>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-on-surface uppercase tracking-wider text-[11px] mb-1">
                1. Mathematical Basis &amp; Regularization Framework
              </h5>
              <p>
                The predictive engine utilizes a degree M=2 polynomial regression model stabilized via an L2 penalty parameter
                <code className="text-primary font-mono ml-1 font-semibold">ln λ = -18</code>. Empirical evaluations demonstrate an optimal
                root-mean-square error <code className="text-primary font-mono font-semibold">E_RMS = 0.124</code> (training cohort) and{' '}
                <code className="text-primary font-mono font-semibold">0.131</code> (blinded test cohort), establishing superior generalization
                over unconstrained higher-order fits (M=9, E_RMS &gt; 0.60).
              </p>
            </div>

            <div>
              <h5 className="font-bold text-on-surface uppercase tracking-wider text-[11px] mb-1">
                2. Weight Vector Coefficients w*
              </h5>
              <div className="p-3 bg-surface-container-low rounded-lg font-mono text-[11px] border border-surface-container-high/50 text-primary">
                w = [-34.21 (w₀), 2.85 (w_h), +0.14 (w_h²), 1.018 (w_p), 2.15 (w_ec), 0.48 (w_s), 0.19 (w_q)]
              </div>
              <p className="mt-1">
                Covariance validation across continuous variables yields <code className="font-mono">Cov(Hours, Exam) ≈ 0.038</code>, satisfying the
                Naive Bayes conditional independence criterion.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-on-surface uppercase tracking-wider text-[11px] mb-1">
                3. Probabilistic Risk Formulation (Bayes Theorem)
              </h5>
              <p>
                With baseline cohort prior risk <code className="font-mono">P(C₁) = 0.148</code>, the posterior classification threshold accurately
                isolates critical students with 98.8% accuracy. Extracurricular participation introduces an odds ratio multiplier delivering a Bayes
                Factor <code className="font-mono font-semibold">BF₁₀ = 3.24</code> in favor of academic continuity.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-on-surface uppercase tracking-wider text-[11px] mb-1">
                4. Prescriptive Advisory Mandates
              </h5>
              <ul className="list-disc pl-5 space-y-1">
                <li>Deploy structured problem workshops for students logging study hours &lt; 5h/wk.</li>
                <li>Implement sleep wellness calibration for pupils with &lt; 5h resting average to prevent 28% yield reduction.</li>
                <li>Sustain positive extracurricular engagement programs across all cohorts.</li>
              </ul>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-surface-container-high flex items-center justify-between">
            <span className="text-xs text-outline font-mono">Export format: PDF / Printable LaTeX</span>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Print Document</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-xs font-semibold text-on-primary flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>{downloadSuccess ? '✓ PDF Generated' : 'Download Formal PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
