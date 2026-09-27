import { SimulationParams } from '../types';

/**
 * Ridge Regression formula fitted on academic performance dataset:
 * y(x, w) = w0 + w1*H + w2*(H^2) + w3*P + w4*EC + w5*S + w6*Q
 * w = [-34.21, 2.85, 0.14, 1.018, 2.15, 0.48, 0.19]
 */
export const MODEL_WEIGHTS = {
  intercept: -34.21,
  hours: 2.85,
  hoursSquared: 0.14,
  previousScore: 1.018,
  extracurricular: 2.15,
  sleep: 0.48,
  papers: 0.19,
};

export const BASELINE_PARAMETERS = {
  meanScore: 55.2,
  variance: 299.3,
  stdDev: 17.3,
  precisionBeta: 1 / 299.3, // 0.00334
  regularizedLambdaLog: -18,
  priorAtRiskProb: 0.148, // 14.8%
};

/**
 * Compute regression prediction for a given set of parameters
 */
export function predictPerformance(params: SimulationParams): number {
  const { hoursStudied, previousScore, extracurricular, sleepHours, papersPracticed } = params;

  let raw =
    MODEL_WEIGHTS.intercept +
    MODEL_WEIGHTS.hours * hoursStudied +
    MODEL_WEIGHTS.hoursSquared * Math.pow(hoursStudied, 2) +
    MODEL_WEIGHTS.previousScore * previousScore +
    (extracurricular ? MODEL_WEIGHTS.extracurricular : 0) +
    MODEL_WEIGHTS.sleep * sleepHours +
    MODEL_WEIGHTS.papers * papersPracticed;

  // Boundary clamp between 10.0 and 100.0
  const clamped = Math.max(10.0, Math.min(100.0, raw));
  return Math.round(clamped * 10) / 10;
}

/**
 * Letter grade calculation and styling
 */
export function getGradeInfo(score: number): {
  grade: string;
  badgeClass: string;
  description: string;
} {
  if (score >= 85) {
    return {
      grade: 'GRADE: A+',
      badgeClass: 'bg-tertiary-container text-white',
      description: 'Mastery / Honors Level',
    };
  } else if (score >= 80) {
    return {
      grade: 'GRADE: A',
      badgeClass: 'bg-tertiary-container text-white',
      description: 'Superior Academic Standing',
    };
  } else if (score >= 70) {
    return {
      grade: 'GRADE: B+',
      badgeClass: 'bg-secondary-container text-on-secondary-container',
      description: 'Solid Above-Average Trajectory',
    };
  } else if (score >= 60) {
    return {
      grade: 'GRADE: B',
      badgeClass: 'bg-secondary text-white',
      description: 'Satisfactory Performance',
    };
  } else if (score >= 50) {
    return {
      grade: 'GRADE: C',
      badgeClass: 'bg-surface-container-high text-on-surface font-semibold',
      description: 'Marginal Passing Band',
    };
  } else if (score >= 35) {
    return {
      grade: 'GRADE: D',
      badgeClass: 'bg-surface-container-highest text-outline font-semibold',
      description: 'Needs Targeted Intervention',
    };
  } else {
    return {
      grade: 'GRADE: F (At Risk)',
      badgeClass: 'bg-error-container text-on-error-container font-semibold',
      description: 'Critical Support Required',
    };
  }
}

/**
 * Normal Gaussian Density function N(x | μ, σ²)
 */
export function gaussianPdf(x: number, mean: number, stdDev: number): number {
  const variance = stdDev * stdDev;
  const factor = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * variance);
  return factor * Math.exp(exponent);
}

/**
 * Naive Bayes Posterior Probability Calculation:
 * P(At-Risk | Evidence) = [P(Evidence | At-Risk) * P(At-Risk)] / P(Evidence)
 */
export function calculateBayesianRisk(params: SimulationParams): {
  riskPercentage: number;
  label: string;
  isHighRisk: boolean;
} {
  const priorRisk = BASELINE_PARAMETERS.priorAtRiskProb; // 0.148
  const priorNormal = 1 - priorRisk; // 0.852

  // 1. Extracurricular likelihood (Bernoulli)
  // P(ec=1 | Risk) = 0.22, P(ec=0 | Risk) = 0.78
  // P(ec=1 | Norm) = 0.68, P(ec=0 | Norm) = 0.32
  const pEcGivenRisk = params.extracurricular ? 0.22 : 0.78;
  const pEcGivenNorm = params.extracurricular ? 0.68 : 0.32;

  // 2. Study hours likelihood (Gaussian)
  // Risk: μ = 2.8, σ = 1.1
  // Norm: μ = 6.4, σ = 1.4
  const pHoursGivenRisk = gaussianPdf(params.hoursStudied, 2.8, 1.1);
  const pHoursGivenNorm = gaussianPdf(params.hoursStudied, 6.4, 1.4);

  // 3. Previous score likelihood (Gaussian)
  // Risk: μ = 48.0, σ = 9.2
  // Norm: μ = 82.5, σ = 11.4
  const pScoreGivenRisk = gaussianPdf(params.previousScore, 48.0, 9.2);
  const pScoreGivenNorm = gaussianPdf(params.previousScore, 82.5, 11.4);

  // Joint likelihood under Naive Bayes conditional independence assumption:
  const jointRisk = pEcGivenRisk * pHoursGivenRisk * pScoreGivenRisk * priorRisk;
  const jointNorm = pEcGivenNorm * pHoursGivenNorm * pScoreGivenNorm * priorNormal;

  const total = jointRisk + jointNorm;
  let posterior = total > 0 ? (jointRisk / total) * 100 : priorRisk * 100;

  // Clamping to sensible bounds
  posterior = Math.max(0.1, Math.min(99.9, posterior));
  const rounded = Math.round(posterior * 10) / 10;

  let label = 'Minimal Risk';
  if (rounded >= 70) label = 'Critical Probation Risk';
  else if (rounded >= 40) label = 'Elevated Risk';
  else if (rounded >= 15) label = 'Moderate Attention';

  return {
    riskPercentage: rounded,
    label: `${rounded}% (${label})`,
    isHighRisk: rounded >= 40,
  };
}

/**
 * Generate polynomial curves for M=0, M=1, M=2 (Ridge), and M=9 (Overfit)
 */
export function getPolynomialCurvePath(degreeMode: 'M0' | 'M1' | 'M2' | 'M9'): {
  path: string;
  eRms: number;
  label: string;
} {
  switch (degreeMode) {
    case 'M0': // Constant mean
      return {
        path: 'M 10 100 L 490 100',
        eRms: 0.28,
        label: 'M=0 (Constant: E_RMS 0.280)',
      };
    case 'M1': // Linear
      return {
        path: 'M 10 170 L 490 50',
        eRms: 0.186,
        label: 'M=1 (Linear: E_RMS 0.186)',
      };
    case 'M9': // High-degree unconstrained overfitting (wild oscillations)
      return {
        path: 'M 10 180 Q 40 40, 75 170 T 140 20 T 210 185 T 270 15 T 340 190 T 410 25 T 490 175',
        eRms: 0.045, // artificially low train error, huge test error
        label: 'M=9 (Unconstrained: Severe Overfitting)',
      };
    case 'M2': // Optimal regularized ridge regression
    default:
      return {
        path: 'M 10 190 Q 75 180, 130 145 T 250 85 T 370 115 T 490 170',
        eRms: 0.124,
        label: 'M=2 + Regularized ln λ=-18 (Optimal: E_RMS 0.124)',
      };
  }
}
