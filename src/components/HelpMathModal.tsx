import React from 'react';

interface HelpMathModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpMathModal: React.FC<HelpMathModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-surface-container-lowest rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-surface-container-high p-6">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-2xl">functions</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Statistical &amp; Machine Learning Telemetry Guide
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div className="my-4 space-y-4 text-xs text-on-surface-variant font-body-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <h4 className="font-bold text-on-surface text-sm">Polynomial Regression with L2 Regularization</h4>
              <p className="mt-1">
                The regression model follows Christopher Bishop&apos;s <em>Pattern Recognition and Machine Learning</em> (PRML) Chapter 1 formulation:
              </p>
              <div className="p-3 bg-surface-container-low rounded-lg font-mono text-[11px] border border-surface-container-high text-primary my-2">
                y(x, w) = ∑ (j=0 to M) w_j · x^j<br />
                E(w) = ½ ∑ (n=1 to N) [y(x_n, w) - t_n]² + (λ/2) ‖w‖²
              </div>
              <p>
                Penalizing the magnitude of the weight coefficients ‖w‖² with <code className="font-mono text-primary font-bold">ln λ = -18</code> prevents
                catastrophic polynomial overfitting while capturing gentle non-linearities (such as the quadratic term for study hours).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-on-surface text-sm">Gaussian Conditional Distribution</h4>
              <p className="mt-1">
                Assuming target scores are distributed around the regression prediction with Gaussian noise of variance σ²:
              </p>
              <div className="p-3 bg-surface-container-low rounded-lg font-mono text-[11px] border border-surface-container-high text-primary my-2">
                p(t | x, w, β) = N(t | y(x, w), β⁻¹)
              </div>
              <p>
                Where precision <code className="font-mono font-bold">β = 1/σ² = 1/299.3 = 0.00334</code>, yielding an empirical standard deviation
                σ = 17.3 points and a 95% confidence interval ±1.96σ.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-on-surface text-sm">Bayesian Risk &amp; Naive Bayes Independence</h4>
              <p className="mt-1">
                Probability of academic risk is updated from baseline prior <code className="font-mono">P(C_risk) = 14.8%</code> via Bayes&apos; theorem.
                Discrete variables like extracurricular participation follow a Bernoulli distribution (delivering a likelihood ratio L = 3.09x and Bayes Factor BF₁₀ = 3.24).
                Continuous variables (study hours and previous examination scores) are factorized conditionally with near-zero covariance (Cov ≈ 0.04).
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-surface-container-high flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-xs font-semibold text-on-primary shadow-xs cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
