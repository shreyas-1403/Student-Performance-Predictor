import React, { useState } from 'react';
import { MODEL_WEIGHTS, BASELINE_PARAMETERS } from '../utils/mathModels';

interface ExportWeightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportWeightsModal: React.FC<ExportWeightsModalProps> = ({ isOpen, onClose }) => {
  const [activeFormat, setActiveFormat] = useState<'json' | 'python' | 'latex' | 'r'>('json');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonContent = JSON.stringify(
    {
      model_type: 'Polynomial Ridge Regression (M=2)',
      regularization: {
        type: 'L2 (Tikhonov / Ridge)',
        ln_lambda: BASELINE_PARAMETERS.regularizedLambdaLog,
        lambda_value: Math.exp(BASELINE_PARAMETERS.regularizedLambdaLog),
      },
      evaluation: {
        train_e_rms: 0.124,
        test_e_rms: 0.131,
        precision_beta: BASELINE_PARAMETERS.precisionBeta,
        mean: BASELINE_PARAMETERS.meanScore,
        variance: BASELINE_PARAMETERS.variance,
      },
      weights: MODEL_WEIGHTS,
      bayesian_priors: {
        prior_at_risk: BASELINE_PARAMETERS.priorAtRiskProb,
        extracurricular_likelihood_ratio: 3.09,
        extracurricular_bayes_factor: 3.24,
      },
    },
    null,
    2
  );

  const pythonContent = `# EduPredict Polynomial Ridge Regression Parameters (M=2)
import numpy as np

WEIGHTS = {
    'intercept': ${MODEL_WEIGHTS.intercept},
    'w_hours': ${MODEL_WEIGHTS.hours},
    'w_hours_squared': ${MODEL_WEIGHTS.hoursSquared},
    'w_prev_score': ${MODEL_WEIGHTS.previousScore},
    'w_extracurricular': ${MODEL_WEIGHTS.extracurricular},
    'w_sleep': ${MODEL_WEIGHTS.sleep},
    'w_papers': ${MODEL_WEIGHTS.papers}
}

LN_LAMBDA = ${BASELINE_PARAMETERS.regularizedLambdaLog}
E_RMS_TRAIN = 0.124
E_RMS_TEST = 0.131

def predict_score(hours, prev_score, ec_bool, sleep_hours, papers):
    y = (WEIGHTS['intercept'] + 
         WEIGHTS['w_hours'] * hours + 
         WEIGHTS['w_hours_squared'] * (hours ** 2) + 
         WEIGHTS['w_prev_score'] * prev_score + 
         (WEIGHTS['w_extracurricular'] if ec_bool else 0) + 
         WEIGHTS['w_sleep'] * sleep_hours + 
         WEIGHTS['w_papers'] * papers)
    return np.clip(y, 10.0, 100.0)
`;

  const latexContent = `% Bishop PRML Polynomial Basis & Regularized Loss
\\begin{aligned}
y(x, \\mathbf{w}) &= w_0 + w_1 x_h + w_2 x_h^2 + w_3 x_p + w_4 x_{ec} + w_5 x_s + w_6 x_q \\\\[6pt]
E(\\mathbf{w}) &= \\frac{1}{2} \\sum_{n=1}^N \\{ y(x_n, \\mathbf{w}) - t_n \\}^2 + \\frac{\\lambda}{2} \\|\\mathbf{w}\\|^2 \\\\[6pt]
\\ln \\lambda &= -18, \\quad E_{\\text{RMS}} = 0.124 \\\\[6pt]
\\mathbf{w}^* &= [-34.21,\\ 2.85,\\ 0.14,\\ 1.018,\\ 2.15,\\ 0.48,\\ 0.19]^T
\\end{aligned}`;

  const rContent = `# R Formulation: EduPredict Regularized Regression
weights <- c(
  w0 = ${MODEL_WEIGHTS.intercept},
  w_hours = ${MODEL_WEIGHTS.hours},
  w_hours2 = ${MODEL_WEIGHTS.hoursSquared},
  w_prev = ${MODEL_WEIGHTS.previousScore},
  w_ec = ${MODEL_WEIGHTS.extracurricular},
  w_sleep = ${MODEL_WEIGHTS.sleep},
  w_papers = ${MODEL_WEIGHTS.papers}
)

ln_lambda <- ${BASELINE_PARAMETERS.regularizedLambdaLog}
e_rms <- 0.124
`;

  const getContent = () => {
    switch (activeFormat) {
      case 'python':
        return pythonContent;
      case 'latex':
        return latexContent;
      case 'r':
        return rContent;
      case 'json':
      default:
        return jsonContent;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const content = getContent();
    const exts = { json: 'json', python: 'py', latex: 'tex', r: 'R' };
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edupredict_weights_${activeFormat}.${exts[activeFormat]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-surface-container-lowest rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-surface-container-high p-6">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">download_for_offline</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Export Fitted Model Weights w*
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Format selector tabs */}
          <div className="mt-4 flex gap-1 p-1 bg-surface-container-low rounded-lg border border-surface-container-high/60">
            <button
              onClick={() => setActiveFormat('json')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeFormat === 'json' ? 'bg-white text-primary shadow-xs' : 'text-outline hover:text-on-surface'
              }`}
            >
              JSON
            </button>
            <button
              onClick={() => setActiveFormat('python')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeFormat === 'python' ? 'bg-white text-primary shadow-xs' : 'text-outline hover:text-on-surface'
              }`}
            >
              Python (NumPy)
            </button>
            <button
              onClick={() => setActiveFormat('latex')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeFormat === 'latex' ? 'bg-white text-primary shadow-xs' : 'text-outline hover:text-on-surface'
              }`}
            >
              LaTeX
            </button>
            <button
              onClick={() => setActiveFormat('r')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeFormat === 'r' ? 'bg-white text-primary shadow-xs' : 'text-outline hover:text-on-surface'
              }`}
            >
              R Script
            </button>
          </div>

          {/* Code Viewer */}
          <div className="mt-4 relative">
            <pre className="p-4 bg-surface-container-low rounded-xl font-mono text-xs text-on-surface max-h-72 overflow-y-auto border border-surface-container-high/60 select-all whitespace-pre-wrap">
              {getContent()}
            </pre>
          </div>

          {/* Footer actions */}
          <div className="mt-5 pt-3 border-t border-surface-container-high flex justify-between items-center">
            <span className="text-xs text-outline font-mono">Precision: 64-bit IEEE float</span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                onClick={handleDownloadFile}
                className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-xs font-semibold text-on-primary flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download File</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
