import React, { useState } from 'react';
import { SimulationParams, SavedSimulation } from '../types';
import { predictPerformance, getGradeInfo, calculateBayesianRisk } from '../utils/mathModels';

interface WhatIfSimulatorScreenProps {
  savedSimulations: SavedSimulation[];
  onSaveSimulation: (sim: SavedSimulation) => void;
  onDeleteSimulation: (id: string) => void;
}

export const WhatIfSimulatorScreen: React.FC<WhatIfSimulatorScreenProps> = ({
  savedSimulations,
  onSaveSimulation,
  onDeleteSimulation,
}) => {
  // Scenario 1 parameters (Baseline editable)
  const [paramsA, setParamsA] = useState<SimulationParams>({
    hoursStudied: 3,
    previousScore: 60,
    extracurricular: false,
    sleepHours: 5,
    papersPracticed: 1,
  });

  // Scenario 2 parameters (Target Intervention)
  const [paramsB, setParamsB] = useState<SimulationParams>({
    hoursStudied: 6,
    previousScore: 60,
    extracurricular: true,
    sleepHours: 7,
    papersPracticed: 4,
  });

  // Regularization Sandbox state
  const [sandboxDegree, setSandboxDegree] = useState(2);
  const [sandboxLambdaLog, setSandboxLambdaLog] = useState(-18);
  const [showAdvancedTuning, setShowAdvancedTuning] = useState(false);

  const scoreA = predictPerformance(paramsA);
  const gradeA = getGradeInfo(scoreA);
  const riskA = calculateBayesianRisk(paramsA);

  const scoreB = predictPerformance(paramsB);
  const gradeB = getGradeInfo(scoreB);
  const riskB = calculateBayesianRisk(paramsB);

  const scoreDelta = Math.round((scoreB - scoreA) * 10) / 10;
  const riskDelta = Math.round((riskA.riskPercentage - riskB.riskPercentage) * 10) / 10;

  // Sandbox RMS calculation
  const getSandboxRms = () => {
    if (sandboxDegree === 0) return { train: 0.28, test: 0.295 };
    if (sandboxDegree === 1) return { train: 0.186, test: 0.198 };
    if (sandboxDegree === 2) {
      if (sandboxLambdaLog < -22) return { train: 0.118, test: 0.145 }; // slight overfit
      if (sandboxLambdaLog > -5) return { train: 0.22, test: 0.23 }; // over-regularized
      return { train: 0.124, test: 0.131 }; // optimal
    }
    // Higher degrees
    if (sandboxDegree >= 6) {
      if (sandboxLambdaLog < -20) return { train: 0.02, test: 0.68 }; // catastrophic overfit
      return { train: 0.115, test: 0.142 };
    }
    return { train: 0.12, test: 0.138 };
  };

  const sandboxRms = getSandboxRms();

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Intervention What-If Simulator
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
            Compare baseline student habits against prospective tutoring, sleep, and practice interventions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvancedTuning(!showAdvancedTuning)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest text-on-surface rounded-lg hover:bg-surface-container font-label-md text-xs font-semibold border border-surface-container-high shadow-2xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-secondary">tune</span>
            <span>{showAdvancedTuning ? 'Hide Model Tuning' : 'Advanced Model Tuning'}</span>
          </button>
          <button
            onClick={() => {
              onSaveSimulation({
                id: `SIM-${Date.now().toString().slice(-4)}`,
                name: `Intervention Comparison (${scoreDelta >= 0 ? '+' : ''}${scoreDelta} pts)`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                params: paramsB,
                predictedScore: scoreB,
                grade: gradeB.grade,
                bayesRisk: riskB.riskPercentage,
                delta: scoreDelta,
              });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary rounded-lg hover:bg-primary-container font-label-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">bookmark_add</span>
            <span>Save Comparison</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-space-xl">
        {/* Left: Scenario A (Baseline / Current) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container-high/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-outline"></span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Scenario A: Current Baseline</h3>
              </div>
              <span className="font-label-sm text-xs px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant border border-surface-container-high">
                Pre-Intervention
              </span>
            </div>

            {/* Scorecard */}
            <div className="my-4 p-4 rounded-xl bg-surface-container-low text-center border border-surface-container-high/40">
              <span className="font-label-sm text-xs uppercase text-outline font-semibold">Predicted Outcome</span>
              <div className="flex items-baseline justify-center gap-2 mt-1">
                <span className="font-data-metric text-data-metric font-bold text-on-surface">
                  {scoreA.toFixed(1)}
                </span>
                <span className="text-on-surface-variant font-medium">/ 100</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-1.5">
                <span className={`px-2 py-0.5 rounded-full font-label-sm text-xs font-bold ${gradeA.badgeClass}`}>
                  {gradeA.grade}
                </span>
                <span className="text-xs text-outline">•</span>
                <span className="text-xs font-mono text-error font-semibold">
                  Bayes Risk: {riskA.riskPercentage}%
                </span>
              </div>
            </div>

            {/* Parameter Controls */}
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Hours Studied / Week</span>
                  <span className="font-mono text-primary">{paramsA.hoursStudied}h</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="9"
                  value={paramsA.hoursStudied}
                  onChange={(e) => setParamsA({ ...paramsA, hoursStudied: parseFloat(e.target.value) })}
                  className="w-full accent-outline h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Previous Exam Score</span>
                  <span className="font-mono text-primary">{paramsA.previousScore} pts</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={paramsA.previousScore}
                  onChange={(e) => setParamsA({ ...paramsA, previousScore: parseFloat(e.target.value) })}
                  className="w-full accent-outline h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container-high/40">
                  <span className="text-xs text-on-surface-variant">Extracurricular</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold">{paramsA.extracurricular ? 'Active' : 'None'}</span>
                    <input
                      type="checkbox"
                      checked={paramsA.extracurricular}
                      onChange={(e) => setParamsA({ ...paramsA, extracurricular: e.target.checked })}
                      className="accent-secondary cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container-high/40">
                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>Sleep</span>
                    <span className="font-mono font-bold text-on-surface">{paramsA.sleepHours}h</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="9"
                    value={paramsA.sleepHours}
                    onChange={(e) => setParamsA({ ...paramsA, sleepHours: parseFloat(e.target.value) })}
                    className="w-full mt-1 accent-outline h-1 bg-surface-container rounded cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Practice Papers</span>
                  <span className="font-mono text-primary">{paramsA.papersPracticed}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="9"
                  value={paramsA.papersPracticed}
                  onChange={(e) => setParamsA({ ...paramsA, papersPracticed: parseFloat(e.target.value) })}
                  className="w-full accent-outline h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center Delta Badge (Mobile & Desktop) */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center gap-3 py-4 lg:py-0">
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm border border-secondary/30 text-center w-full">
            <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider font-semibold">
              Projected Net Gain
            </span>
            <div className={`font-data-metric text-3xl font-bold mt-1 ${scoreDelta >= 0 ? 'text-tertiary-container' : 'text-error'}`}>
              {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta}
              <span className="text-sm font-normal text-on-surface-variant ml-0.5">pts</span>
            </div>

            <div className="mt-3 pt-3 border-t border-surface-container-high flex flex-col gap-1 text-xs">
              <div className="flex justify-between">
                <span className="text-outline">Risk Reduction:</span>
                <span className="font-mono font-bold text-tertiary-container">
                  {riskDelta >= 0 ? `-${riskDelta}%` : `+${Math.abs(riskDelta)}%`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Probation Shift:</span>
                <span className="font-semibold text-secondary">
                  {riskB.riskPercentage < 40 ? 'Defused' : 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Scenario B (Intervention Candidate) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-secondary/40 ring-1 ring-secondary/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Scenario B: Target Intervention</h3>
              </div>
              <span className="font-label-sm text-xs px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-semibold">
                Simulated Policy
              </span>
            </div>

            {/* Scorecard */}
            <div className="my-4 p-4 rounded-xl bg-secondary/5 text-center border border-secondary/20">
              <span className="font-label-sm text-xs uppercase text-secondary font-semibold">Simulated Outcome</span>
              <div className="flex items-baseline justify-center gap-2 mt-1">
                <span className="font-data-metric text-data-metric font-bold text-secondary">
                  {scoreB.toFixed(1)}
                </span>
                <span className="text-on-surface-variant font-medium">/ 100</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-1.5">
                <span className={`px-2 py-0.5 rounded-full font-label-sm text-xs font-bold ${gradeB.badgeClass}`}>
                  {gradeB.grade}
                </span>
                <span className="text-xs text-outline">•</span>
                <span className="text-xs font-mono text-tertiary-container font-semibold">
                  Bayes Risk: {riskB.riskPercentage}%
                </span>
              </div>
            </div>

            {/* Parameter Controls */}
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Hours Studied / Week (Guided Tutoring)</span>
                  <span className="font-mono text-secondary font-bold">{paramsB.hoursStudied}h</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="9"
                  value={paramsB.hoursStudied}
                  onChange={(e) => setParamsB({ ...paramsB, hoursStudied: parseFloat(e.target.value) })}
                  className="w-full accent-secondary h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Previous Exam Score (Baseline Anchor)</span>
                  <span className="font-mono text-secondary font-bold">{paramsB.previousScore} pts</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={paramsB.previousScore}
                  onChange={(e) => setParamsB({ ...paramsB, previousScore: parseFloat(e.target.value) })}
                  className="w-full accent-secondary h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-secondary/5 border border-secondary/20">
                  <span className="text-xs text-on-surface-variant">Extracurricular Engagement</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-primary">{paramsB.extracurricular ? 'Active' : 'None'}</span>
                    <input
                      type="checkbox"
                      checked={paramsB.extracurricular}
                      onChange={(e) => setParamsB({ ...paramsB, extracurricular: e.target.checked })}
                      className="accent-secondary cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-secondary/5 border border-secondary/20">
                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>Sleep / Night</span>
                    <span className="font-mono font-bold text-primary">{paramsB.sleepHours}h</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="9"
                    value={paramsB.sleepHours}
                    onChange={(e) => setParamsB({ ...paramsB, sleepHours: parseFloat(e.target.value) })}
                    className="w-full mt-1 accent-secondary h-1 bg-surface-container rounded cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Practice Papers (Mock Exams)</span>
                  <span className="font-mono text-secondary font-bold">{paramsB.papersPracticed} papers</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="9"
                  value={paramsB.papersPracticed}
                  onChange={(e) => setParamsB({ ...paramsB, papersPracticed: parseFloat(e.target.value) })}
                  className="w-full accent-secondary h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Regularization & Polynomial Degree Tuning Sandbox (Collapsible) */}
      {showAdvancedTuning && (
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-surface-container-high/70 mb-space-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-lg">science</span>
              </span>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Regularization &amp; Polynomial Order Tuning Lab
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Observe the Bias-Variance tradeoff dynamically by adjusting Polynomial Order M and Penalty ln λ.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="bg-surface-container-low px-2.5 py-1 rounded text-primary font-semibold border border-surface-container-high">
                Train E_RMS: {sandboxRms.train.toFixed(3)}
              </span>
              <span className={`px-2.5 py-1 rounded font-semibold border ${sandboxRms.test > 0.2 ? 'bg-error-container text-on-error-container border-error/30' : 'bg-surface-container-low text-secondary border-surface-container-high'}`}>
                Test E_RMS: {sandboxRms.test.toFixed(3)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-4 rounded-xl border border-surface-container-high/50">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <label htmlFor="degreeSlider">Polynomial Degree Order M (0 to 9)</label>
                <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-mono font-bold">
                  M = {sandboxDegree}
                </span>
              </div>
              <input
                id="degreeSlider"
                type="range"
                min="0"
                max="9"
                step="1"
                value={sandboxDegree}
                onChange={(e) => setSandboxDegree(parseInt(e.target.value))}
                className="w-full accent-secondary h-2 bg-surface-container rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-outline mt-1 font-mono">
                <span>M=0 (Underfit)</span>
                <span className="text-secondary font-bold">M=2 (Optimal Ridge)</span>
                <span className="text-error font-bold">M=9 (Overfit)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <label htmlFor="lambdaSlider">Regularization Parameter (L2 Penalty ln λ)</label>
                <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-mono font-bold">
                  ln λ = {sandboxLambdaLog}
                </span>
              </div>
              <input
                id="lambdaSlider"
                type="range"
                min="-30"
                max="5"
                step="1"
                value={sandboxLambdaLog}
                onChange={(e) => setSandboxLambdaLog(parseInt(e.target.value))}
                className="w-full accent-secondary h-2 bg-surface-container rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-outline mt-1 font-mono">
                <span>ln λ = -30 (No Penalty)</span>
                <span className="text-secondary font-bold">ln λ = -18 (Balanced)</span>
                <span>ln λ = 0 (Strong L2)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Simulations Drawer / List */}
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container-high/70">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">history</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Saved Simulation Library</h3>
          </div>
          <span className="font-label-sm text-xs text-outline">{savedSimulations.length} Scenarios Logged</span>
        </div>

        {savedSimulations.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-low rounded-lg border border-dashed border-surface-container-high text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-3xl text-outline mb-1">science</span>
            <p className="font-medium text-on-surface">No simulation scenarios saved yet</p>
            <p className="text-xs text-outline mt-0.5">
              Click &quot;Save Simulation&quot; in the Quick Predictor or What-If Sandbox to compare policies.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedSimulations.map((sim) => (
              <div
                key={sim.id}
                className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/70 flex flex-col justify-between hover:shadow-xs transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-label-md text-xs font-bold text-on-surface">{sim.name}</span>
                    <button
                      onClick={() => onDeleteSimulation(sim.id)}
                      className="text-outline hover:text-error transition-colors p-1"
                      title="Delete Scenario"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-outline font-mono">{sim.timestamp}</span>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-data-metric text-2xl font-bold text-primary">
                      {sim.predictedScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-on-surface-variant font-mono">
                      Delta: {sim.delta >= 0 ? `+${sim.delta}%` : `${sim.delta}%`}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-on-surface-variant flex flex-wrap gap-2 font-mono">
                    <span>{sim.params.hoursStudied}h study</span>
                    <span>•</span>
                    <span>{sim.params.sleepHours}h sleep</span>
                    <span>•</span>
                    <span>{sim.params.extracurricular ? 'EC: Yes' : 'EC: No'}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-surface-container-high/60 flex justify-between items-center text-xs">
                  <span className="font-semibold text-secondary">{sim.grade}</span>
                  <button
                    onClick={() => {
                      setParamsB(sim.params);
                    }}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Load into Sandbox →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
