import React, { useState } from 'react';

export const FeatureInsightsScreen: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<'hours' | 'prev' | 'ec' | 'sleep' | 'papers'>('hours');

  const features = [
    {
      id: 'hours' as const,
      name: 'Hours Studied / Week',
      weight: '+2.85 (+0.14 H²)',
      relativeImpact: '38.4%',
      type: 'Continuous (Gaussian)',
      description: 'Primary driver of performance index. Non-linear quadratic term models diminishing marginal returns beyond 8 hours.',
      pdpPoints: [
        { x: 1, y: 15.2 },
        { x: 2, y: 22.1 },
        { x: 3, y: 31.8 },
        { x: 4, y: 44.5 },
        { x: 5, y: 55.2 },
        { x: 6, y: 67.0 },
        { x: 7, y: 78.4 },
        { x: 8, y: 88.2 },
        { x: 9, y: 95.0 },
      ],
      unit: 'hours',
    },
    {
      id: 'prev' as const,
      name: 'Previous Exam Score',
      weight: '+1.018',
      relativeImpact: '41.2%',
      type: 'Continuous (Gaussian)',
      description: 'Historical foundation anchor. High baseline scores consistently buffer against sporadic study dips.',
      pdpPoints: [
        { x: 40, y: 30.0 },
        { x: 50, y: 41.5 },
        { x: 60, y: 52.0 },
        { x: 70, y: 63.2 },
        { x: 80, y: 74.0 },
        { x: 90, y: 85.5 },
        { x: 100, y: 96.0 },
      ],
      unit: 'points',
    },
    {
      id: 'ec' as const,
      name: 'Extracurricular Participation',
      weight: '+2.15',
      relativeImpact: '9.5%',
      type: 'Discrete (Bernoulli {0, 1})',
      description: 'Delivers a +2.15 linear intercept boost and Bayes Factor BF₁₀ = 3.24 protection against academic probation.',
      pdpPoints: [
        { x: 0, y: 52.4 },
        { x: 1, y: 57.8 },
      ],
      unit: 'binary',
    },
    {
      id: 'sleep' as const,
      name: 'Sleep / Night',
      weight: '+0.48',
      relativeImpact: '6.4%',
      type: 'Continuous (Gaussian)',
      description: 'Critical cognitive recovery factor. Severe sleep deprivation (<5h) dampens study yield by 28%.',
      pdpPoints: [
        { x: 4, y: 48.0 },
        { x: 5, y: 51.5 },
        { x: 6, y: 54.0 },
        { x: 7, y: 56.5 },
        { x: 8, y: 57.8 },
        { x: 9, y: 58.2 },
      ],
      unit: 'hours',
    },
    {
      id: 'papers' as const,
      name: 'Sample Question Papers',
      weight: '+0.19',
      relativeImpact: '4.5%',
      type: 'Discrete Count (Poisson)',
      description: 'Procedural familiarity and test anxiety reduction through timed practice mock papers.',
      pdpPoints: [
        { x: 0, y: 53.0 },
        { x: 2, y: 54.2 },
        { x: 4, y: 55.6 },
        { x: 6, y: 57.0 },
        { x: 8, y: 58.4 },
      ],
      unit: 'papers',
    },
  ];

  const currentFeatureData = features.find((f) => f.id === selectedFeature)!;

  // Covariance / Correlation Matrix data
  const matrixHeaders = ['Hours (H)', 'Prev (P)', 'EC (E)', 'Sleep (S)', 'Papers (Q)'];
  const correlationMatrix = [
    [1.00, 0.04, 0.08, 0.12, 0.18],
    [0.04, 1.00, 0.03, 0.09, 0.14],
    [0.08, 0.03, 1.00, 0.05, 0.07],
    [0.12, 0.09, 0.05, 1.00, 0.02],
    [0.18, 0.14, 0.07, 0.02, 1.00],
  ];

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Key Academic Success Drivers
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
            Understand how study habits, sleep, prior exams, and extracurriculars influence student grade outcomes.
          </p>
        </div>
      </div>

      {/* Feature Influence Ranking Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-space-xl">
        {features.map((feat) => {
          const isSelected = selectedFeature === feat.id;
          return (
            <div
              key={feat.id}
              onClick={() => setSelectedFeature(feat.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-surface-container-lowest border-secondary shadow-md ring-2 ring-secondary/20'
                  : 'bg-surface-container-lowest border-surface-container-high/70 hover:border-secondary/40 shadow-xs'
              }`}
            >
              <span className="font-label-sm text-[10px] uppercase text-outline font-semibold tracking-wider">
                {feat.type}
              </span>
              <div className="font-title-md text-sm font-bold text-on-surface mt-1 truncate">
                {feat.name}
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono text-xs font-bold text-primary">{feat.weight}</span>
                <span className="font-label-sm text-xs font-semibold text-secondary">{feat.relativeImpact}</span>
              </div>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-secondary h-full rounded-full"
                  style={{ width: feat.relativeImpact }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Feature Explorer & Covariance Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column (7 Cols): Partial Dependence Plot (PDP) */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-surface-container-high/70">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
            <div>
              <span className="font-label-sm text-xs text-outline uppercase tracking-wider font-semibold">
                Partial Dependence Profile
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">
                {currentFeatureData.name} Marginal Yield
              </h3>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-surface-container text-primary font-bold border border-surface-container-highest">
              Weight: {currentFeatureData.weight}
            </span>
          </div>

          <p className="font-body-sm text-sm text-on-surface-variant my-4 leading-relaxed">
            {currentFeatureData.description}
          </p>

          {/* SVG Visualizer for PDP */}
          <div className="h-56 w-full relative bg-surface-container-low rounded-xl p-4 border border-surface-container-high/50 flex flex-col justify-between">
            <div className="flex justify-between text-xs text-outline font-mono">
              <span>Predicted Score Range (0 - 100)</span>
              <span>Input: {currentFeatureData.unit}</span>
            </div>

            {/* SVG line chart */}
            <svg className="w-full h-36 overflow-visible" viewBox="0 0 400 120">
              <defs>
                <linearGradient id="pdpGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2170e4" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#2170e4" stopOpacity="0.01"></stop>
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="#c5c5d3" strokeOpacity="0.3" strokeDasharray="3 3"></line>
              <line x1="0" y1="60" x2="400" y2="60" stroke="#c5c5d3" strokeOpacity="0.3" strokeDasharray="3 3"></line>
              <line x1="0" y1="100" x2="400" y2="100" stroke="#c5c5d3" strokeOpacity="0.3" strokeDasharray="3 3"></line>

              {/* Data points mapping */}
              {currentFeatureData.pdpPoints.map((pt, i, arr) => {
                const xPos = (i / (arr.length - 1)) * 380 + 10;
                const yPos = 110 - (pt.y / 100) * 90;
                const nextPt = arr[i + 1];
                let lineElem = null;
                if (nextPt) {
                  const nextX = ((i + 1) / (arr.length - 1)) * 380 + 10;
                  const nextY = 110 - (nextPt.y / 100) * 90;
                  lineElem = (
                    <line
                      key={`l-${i}`}
                      x1={xPos}
                      y1={yPos}
                      x2={nextX}
                      y2={nextY}
                      stroke="#0058be"
                      strokeWidth="2.5"
                    />
                  );
                }
                return (
                  <g key={`p-${i}`}>
                    {lineElem}
                    <circle cx={xPos} cy={yPos} r="4" fill="#00236f" stroke="#ffffff" strokeWidth="2" />
                    <text
                      x={xPos}
                      y={yPos - 8}
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      fill="#0b1c30"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {pt.y.toFixed(1)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] font-mono text-outline px-1">
              {currentFeatureData.pdpPoints.map((pt) => (
                <span key={pt.x}>
                  {pt.x}
                  {currentFeatureData.id === 'hours' || currentFeatureData.id === 'sleep' ? 'h' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Correlation & Covariance Matrix */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-surface-container-high/70">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
            <div>
              <span className="font-label-sm text-xs text-outline uppercase tracking-wider font-semibold">
                Information Theory
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">
                Feature Covariance Matrix
              </h3>
            </div>
            <span className="material-symbols-outlined text-secondary">grid_4x4</span>
          </div>

          <p className="font-body-sm text-xs text-on-surface-variant my-3 leading-relaxed">
            Near-zero off-diagonal covariance entries validate the Naive Bayes conditional independence assumption:
            <code className="text-primary font-mono ml-1 font-semibold">p(x|C) = ∏ p(x_i|C)</code>.
          </p>

          {/* Matrix Grid */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-center font-mono text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-outline font-sans text-[11px]"></th>
                  {matrixHeaders.map((hdr) => (
                    <th key={hdr} className="p-1.5 text-on-surface-variant font-bold text-[10px]">
                      {hdr}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correlationMatrix.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className="p-1.5 text-left text-on-surface font-bold text-[10px] whitespace-nowrap">
                      {matrixHeaders[rowIdx]}
                    </td>
                    {row.map((val, colIdx) => {
                      const isDiagonal = rowIdx === colIdx;
                      let bgClass = 'bg-surface-container-low text-on-surface-variant';
                      if (isDiagonal) {
                        bgClass = 'bg-primary text-on-primary font-bold';
                      } else if (val > 0.15) {
                        bgClass = 'bg-secondary/20 text-primary font-bold';
                      } else if (val < 0.05) {
                        bgClass = 'bg-surface-container-high text-tertiary-container font-semibold';
                      }

                      return (
                        <td key={colIdx} className="p-1">
                          <div
                            className={`py-2 px-1 rounded transition-colors ${bgClass}`}
                            title={`Corr(${matrixHeaders[rowIdx]}, ${matrixHeaders[colIdx]}) = ${val.toFixed(2)}`}
                          >
                            {val.toFixed(2)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-surface-container-low rounded-lg text-xs text-on-surface-variant flex items-center gap-2 border border-surface-container-high/40">
            <span className="material-symbols-outlined text-tertiary-container text-base">verified</span>
            <span>
              <strong className="text-on-surface">Maximum observed covariance:</strong> 0.18 (Hours vs. Papers).
              Factorization holds without significant bias penalty.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
