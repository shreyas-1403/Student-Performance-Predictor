import React, { useState } from 'react';
import {
  predictPerformance,
  getGradeInfo,
  calculateBayesianRisk,
} from '../utils/mathModels';
import { Student, SimulationParams, SavedSimulation } from '../types';

interface OverviewScreenProps {
  students: Student[];
  onNavigateToRoster: () => void;
  onSaveSimulation: (sim: SavedSimulation) => void;
  onSelectStudent: (student: Student) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  students,
  onNavigateToRoster,
  onSaveSimulation,
  onSelectStudent,
}) => {
  // Quick predictor state
  const [params, setParams] = useState<SimulationParams>({
    hoursStudied: 6,
    previousScore: 84,
    extracurricular: true,
    sleepHours: 7,
    papersPracticed: 4,
  });

  // Active hover bin
  const [hoveredBin, setHoveredBin] = useState<string | null>(null);

  // Simulation saved feedback
  const [saveToast, setSaveToast] = useState(false);

  // Compute live prediction
  const currentScore = predictPerformance(params);
  const gradeInfo = getGradeInfo(currentScore);
  const bayesRisk = calculateBayesianRisk(params);

  // Calculate delta against baseline mean (55.2)
  const delta = Math.round((currentScore - 55.2) * 10) / 10;
  const deltaFormatted = delta >= 0 ? `+${delta}%` : `${delta}%`;

  const handleReset = () => {
    setParams({
      hoursStudied: 6,
      previousScore: 84,
      extracurricular: true,
      sleepHours: 7,
      papersPracticed: 4,
    });
  };

  const handleSave = () => {
    const newSim: SavedSimulation = {
      id: `SIM-${Date.now().toString().slice(-4)}`,
      name: `Simulation (${params.hoursStudied}h, ${params.previousScore}pts)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      params: { ...params },
      predictedScore: currentScore,
      grade: gradeInfo.grade,
      bayesRisk: bayesRisk.riskPercentage,
      delta,
    };
    onSaveSimulation(newSim);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // 5 benchmark students
  const benchmarkStudents = students.slice(0, 5);

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Clean, Human Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Cohort Performance &amp; Predictions
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
            Monitor class progress, forecast student exam outcomes, and deploy timely interventions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg text-on-surface font-body-sm shadow-2xs border border-surface-container-high/60">
            <span className="inline-block w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
            <span className="text-xs font-semibold text-on-surface">Predictive Engine Active</span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs text-outline">98.8% Accuracy</span>
          </div>
        </div>
      </div>

      {/* 4 Clean, Actionable KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter mb-space-xl">
        {/* KPI 1: Class Average Score */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container-high/70 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
              Class Average
            </span>
            <span className="font-label-sm text-xs text-secondary font-medium bg-surface-container px-2 py-0.5 rounded-full">
              Fall 2024
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-data-metric text-data-metric text-on-surface font-bold">55.2</span>
            <span className="text-xs text-on-surface-variant font-medium">/ 100</span>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1">
            Median: 55.0 · Top 10%: ≥78.4
          </p>
          <div className="mt-3 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '55.2%' }}></div>
          </div>
        </div>

        {/* KPI 2: Students At Risk */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container-high/70 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
              Students At Risk
            </span>
            <span className="font-label-sm text-xs text-on-error-container font-semibold bg-error-container px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">warning</span>4 Flagged
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-data-metric text-data-metric text-error font-bold">14.8%</span>
            <span className="text-xs text-on-surface-variant font-medium">of cohort</span>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1">
            Predicted &lt;40 pts without intervention
          </p>
          <div className="mt-3 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-error h-full rounded-full" style={{ width: '14.8%' }}></div>
          </div>
        </div>

        {/* KPI 3: Projected Pass Rate */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container-high/70 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
              Projected Pass Rate
            </span>
            <span className="font-label-sm text-xs text-tertiary-container font-semibold bg-surface-container px-2 py-0.5 rounded-full">
              Target: 80%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-data-metric text-data-metric text-tertiary-container font-bold">85.2%</span>
            <span className="text-xs text-tertiary-container font-medium font-semibold">+3.4% vs mid-term</span>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1">
            Forecasted to meet academic standard
          </p>
          <div className="mt-3 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-tertiary-container h-full rounded-full" style={{ width: '85.2%' }}></div>
          </div>
        </div>

        {/* KPI 4: Weekly Study Average */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container-high/70 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
              Weekly Study Average
            </span>
            <span className="font-label-sm text-xs text-primary font-semibold bg-surface-container px-2 py-0.5 rounded-full">
              Benchmark: 6h
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-data-metric text-data-metric text-primary font-bold">5.6h</span>
            <span className="text-xs text-on-surface-variant font-medium">per student</span>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1">
            Single largest predictor of grade outcome
          </p>
          <div className="mt-3 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '62%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Asymmetric Layout: Left (Charts & Data) / Right (Simulator & Guidance) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* LEFT COLUMN: 60% */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Card 1: Score Distribution Chart */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-surface-container-high/70">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                  Class Score Distribution &amp; Predictive Curve
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Visualizing student density across score brackets with expected median marker.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-secondary"></span>Actual Distribution
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-primary"></span>Fitted Trajectory
                </span>
              </div>
            </div>

            {/* Distribution Graph */}
            <div className="relative w-full h-56 pt-4">
              {/* SVG Curve */}
              <svg
                className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-10"
                preserveAspectRatio="none"
                viewBox="0 0 500 200"
              >
                <defs>
                  <linearGradient id="curveFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2170e4" stopOpacity="0.18"></stop>
                    <stop offset="100%" stopColor="#2170e4" stopOpacity="0.02"></stop>
                  </linearGradient>
                </defs>

                {/* Shaded confidence region */}
                <path
                  d="M 15 195 C 100 195, 170 170, 210 95 C 240 40, 260 40, 290 95 C 330 170, 400 195, 485 195 Z"
                  fill="url(#curveFill)"
                ></path>

                {/* Primary Bell Curve */}
                <path
                  d="M 15 195 C 100 195, 170 170, 210 95 C 240 40, 260 40, 290 95 C 330 170, 400 195, 485 195"
                  fill="none"
                  stroke="#00236f"
                  strokeWidth="2.5"
                ></path>

                {/* Threshold & Mean lines */}
                <line stroke="#ba1a1a" strokeDasharray="3 3" strokeWidth="1.5" x1="100" x2="100" y1="30" y2="195"></line>
                <line stroke="#00236f" strokeWidth="2" x1="250" x2="250" y1="15" y2="195"></line>
                <line stroke="#004a31" strokeDasharray="3 3" strokeWidth="1.5" x1="410" x2="410" y1="30" y2="195"></line>

                <text fill="#ba1a1a" fontSize="10" fontWeight="bold" x="75" y="24">
                  At-Risk (&lt;35)
                </text>
                <text fill="#00236f" fontSize="11" fontWeight="bold" x="225" y="14">
                  Average (55.2)
                </text>
                <text fill="#004a31" fontSize="10" fontWeight="bold" x="385" y="24">
                  Honors (≥80)
                </text>
              </svg>

              {/* 5 Clean Score Range Columns */}
              <div className="relative h-full flex items-end justify-between gap-3 px-3 z-0">
                <div
                  onMouseEnter={() => setHoveredBin('0-20: 3% of students')}
                  onMouseLeave={() => setHoveredBin(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                >
                  <span className="text-[11px] font-semibold text-outline group-hover:text-primary mb-1">
                    3%
                  </span>
                  <div className="w-full max-w-[56px] bg-error-container/40 group-hover:bg-error-container transition-all rounded-t-md h-[12%]"></div>
                  <span className="text-xs font-medium text-on-surface-variant mt-2">0–20</span>
                  <span className="text-[10px] text-error font-semibold">Critical</span>
                </div>

                <div
                  onMouseEnter={() => setHoveredBin('21-40: 19% of students')}
                  onMouseLeave={() => setHoveredBin(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                >
                  <span className="text-[11px] font-semibold text-outline group-hover:text-primary mb-1">
                    19%
                  </span>
                  <div className="w-full max-w-[56px] bg-secondary/20 group-hover:bg-secondary/35 transition-all rounded-t-md h-[44%]"></div>
                  <span className="text-xs font-medium text-on-surface-variant mt-2">21–40</span>
                  <span className="text-[10px] text-outline">Lower 25%</span>
                </div>

                <div
                  onMouseEnter={() => setHoveredBin('41-60: 44% of students (Class Peak)')}
                  onMouseLeave={() => setHoveredBin(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-primary mb-1">
                    44%
                  </span>
                  <div className="w-full max-w-[56px] bg-secondary group-hover:bg-primary-container transition-all rounded-t-md h-[92%] shadow-sm"></div>
                  <span className="text-xs font-bold text-on-surface mt-2">41–60</span>
                  <span className="text-[10px] text-primary font-bold">Class Peak</span>
                </div>

                <div
                  onMouseEnter={() => setHoveredBin('61-80: 24% of students')}
                  onMouseLeave={() => setHoveredBin(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                >
                  <span className="text-[11px] font-semibold text-outline group-hover:text-primary mb-1">
                    24%
                  </span>
                  <div className="w-full max-w-[56px] bg-secondary-container/60 group-hover:bg-secondary-container transition-all rounded-t-md h-[55%]"></div>
                  <span className="text-xs font-medium text-on-surface-variant mt-2">61–80</span>
                  <span className="text-[10px] text-outline">Upper 25%</span>
                </div>

                <div
                  onMouseEnter={() => setHoveredBin('81-100: 10% of students')}
                  onMouseLeave={() => setHoveredBin(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                >
                  <span className="text-[11px] font-semibold text-outline group-hover:text-primary mb-1">
                    10%
                  </span>
                  <div className="w-full max-w-[56px] bg-tertiary-container/30 group-hover:bg-tertiary-container/50 transition-all rounded-t-md h-[25%]"></div>
                  <span className="text-xs font-medium text-on-surface-variant mt-2">81–100</span>
                  <span className="text-[10px] text-tertiary-container font-semibold">Honors</span>
                </div>
              </div>
            </div>

            {/* Quick Helper Note */}
            <div className="mt-4 p-3 bg-surface-container-low rounded-lg text-xs text-on-surface-variant flex items-center justify-between border border-surface-container-high/40">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-secondary">info</span>
                <span>
                  {hoveredBin || 'Hover over score brackets to view cohort counts and details.'}
                </span>
              </span>
              <button
                onClick={onNavigateToRoster}
                className="text-secondary hover:underline font-semibold cursor-pointer text-xs"
              >
                View all students →
              </button>
            </div>
          </div>

          {/* Card 2: Student Highlight Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high/70 overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-surface-container-high/60">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                  Recent Student Evaluations
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Sample records with current study habits and projected score.
                </p>
              </div>
              <button
                onClick={onNavigateToRoster}
                className="text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                Open Full Roster →
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-on-surface border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-outline text-xs tracking-wider uppercase border-b border-surface-container-high">
                    <th className="py-2.5 px-4 font-semibold">Student</th>
                    <th className="py-2.5 px-3 font-semibold">Study Time</th>
                    <th className="py-2.5 px-3 font-semibold">Prior Exam</th>
                    <th className="py-2.5 px-3 font-semibold">Predicted</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/40 text-xs">
                  {benchmarkStudents.map((st) => (
                    <tr
                      key={st.id}
                      onClick={() => onSelectStudent(st)}
                      className={`hover:bg-surface-container-low/80 transition-colors cursor-pointer ${
                        st.status === 'Critical Support' ? 'bg-error-container/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-on-surface">{st.name}</div>
                        <div className="text-[10px] text-outline font-mono">{st.id}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-on-surface">{st.hoursStudied} hrs/wk</td>
                      <td className="py-3 px-3 font-medium text-on-surface">{st.previousScore} / 100</td>
                      <td className="py-3 px-3 font-bold text-primary text-sm">
                        {st.predictedScore.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {st.status === 'High Performer' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-surface-container text-tertiary-container font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>High Performer
                          </span>
                        )}
                        {st.status === 'On Track' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-surface-container-high text-secondary font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>On Track
                          </span>
                        )}
                        {st.status === 'Needs Review' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-surface-container-high text-on-surface-variant font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>Needs Review
                          </span>
                        )}
                        {st.status === 'Critical Support' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-error-container text-on-error-container font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>Critical Support
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 40% */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          {/* Quick Predictor Simulator Card */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-surface-container-high/70">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-surface-container text-secondary">
                  <span className="material-symbols-outlined text-lg">tune</span>
                </span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Student Score Simulator
                  </h3>
                  <p className="text-xs text-on-surface-variant">Adjust habits to preview grade outcome</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="text-outline hover:text-on-surface text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-xs">restart_alt</span> Reset
              </button>
            </div>

            {/* Score Result Box */}
            <div className="bg-surface-container-low rounded-xl p-4 mb-5 text-center border border-surface-container-high/50">
              <div className="flex items-baseline justify-center gap-2">
                <span className="font-data-metric text-4xl font-bold text-primary">
                  {currentScore.toFixed(1)}
                </span>
                <span className="text-on-surface-variant font-semibold text-sm">/ 100</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${gradeInfo.badgeClass}`}>
                  {gradeInfo.grade}
                </span>
                <span className="text-outline text-xs">•</span>
                <span className={`text-xs font-semibold ${bayesRisk.isHighRisk ? 'text-error' : 'text-tertiary-container'}`}>
                  {bayesRisk.isHighRisk ? '⚠️ High Risk of Probation' : '✓ Good Academic Standing'}
                </span>
              </div>
              <div className="w-full mt-3 bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary-container to-secondary rounded-full transition-all duration-300"
                  style={{ width: `${currentScore}%` }}
                ></div>
              </div>
            </div>

            {/* Clean Input Sliders */}
            <div className="space-y-4">
              {/* Slider 1: Study Time */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-semibold text-on-surface">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-base">schedule</span>
                    <span>Weekly Study Hours</span>
                  </span>
                  <span className="text-primary font-bold bg-surface-container-low px-2 py-0.5 rounded border border-surface-container-high">
                    {params.hoursStudied} hrs
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="9"
                  step="1"
                  value={params.hoursStudied}
                  onChange={(e) => setParams({ ...params, hoursStudied: parseFloat(e.target.value) })}
                  className="w-full accent-secondary h-1.5 bg-surface-container rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Prior Score */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-semibold text-on-surface">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-base">history_edu</span>
                    <span>Previous Exam Score</span>
                  </span>
                  <span className="text-primary font-bold bg-surface-container-low px-2 py-0.5 rounded border border-surface-container-high">
                    {params.previousScore} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="1"
                  value={params.previousScore}
                  onChange={(e) => setParams({ ...params, previousScore: parseFloat(e.target.value) })}
                  className="w-full accent-secondary h-1.5 bg-surface-container rounded-lg cursor-pointer"
                />
              </div>

              {/* 2-Column: Extracurricular & Sleep */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-surface-container-low p-3 rounded-lg border border-surface-container-high/50 flex flex-col justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">Activities</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-primary">
                      {params.extracurricular ? 'Active' : 'None'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={params.extracurricular}
                        onChange={(e) => setParams({ ...params, extracurricular: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-surface-container-low p-3 rounded-lg border border-surface-container-high/50 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant font-medium">Sleep / Night</span>
                    <span className="font-bold text-primary">{params.sleepHours}h</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="9"
                    step="1"
                    value={params.sleepHours}
                    onChange={(e) => setParams({ ...params, sleepHours: parseFloat(e.target.value) })}
                    className="w-full mt-2 accent-secondary h-1.5 bg-surface-container rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Slider: Practice Papers */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-semibold text-on-surface">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-base">quiz</span>
                    <span>Practice Mock Papers</span>
                  </span>
                  <span className="text-primary font-bold bg-surface-container-low px-2 py-0.5 rounded border border-surface-container-high">
                    {params.papersPracticed} {params.papersPracticed === 1 ? 'paper' : 'papers'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="9"
                  step="1"
                  value={params.papersPracticed}
                  onChange={(e) => setParams({ ...params, papersPracticed: parseFloat(e.target.value) })}
                  className="w-full accent-secondary h-1.5 bg-surface-container rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-5 pt-3 flex items-center justify-between text-xs text-on-surface-variant border-t border-surface-container-high">
              <span className="flex items-center gap-1 font-medium">
                <span>Predicted gain: <strong className="text-tertiary-container">{deltaFormatted}</strong></span>
              </span>
              <button
                onClick={handleSave}
                className="text-secondary hover:text-primary font-semibold cursor-pointer"
                type="button"
              >
                {saveToast ? '✓ Scenario Saved' : 'Save Scenario'}
              </button>
            </div>
          </div>

          {/* Practical Advisor Guidance */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container-high/70 space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-lg">lightbulb</span>
              <h3 className="font-title-md text-sm font-bold text-on-surface">Recommended Actions</h3>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low border border-surface-container-high/40 flex items-start gap-2.5 text-xs">
              <span className="material-symbols-outlined text-error text-base shrink-0 mt-0.5">priority_high</span>
              <p className="text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">Study Workshop Lift:</strong> Students studying under 5h weekly benefit most from a +2h structured study hall to avoid falling into critical status.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low border border-surface-container-high/40 flex items-start gap-2.5 text-xs">
              <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">bedtime</span>
              <p className="text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">Sleep Routine:</strong> Data indicates sleeping under 5h dampens learning retention by up to 28%. Maintain 7–8h before exams.
              </p>
            </div>
          </div>

          {/* Extracurricular Advantage Card */}
          <div className="bg-primary text-on-primary rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase tracking-wider text-inverse-primary font-semibold">
                Engagement Impact
              </span>
              <span className="material-symbols-outlined text-inverse-primary text-base">groups</span>
            </div>
            <h4 className="font-headline-sm text-sm font-bold text-on-primary">
              Extracurricular Activities Boost
            </h4>
            <p className="text-xs text-inverse-primary/90 mt-1.5 leading-relaxed">
              Students involved in clubs, arts, or sports average <strong className="text-white">+2.2 points higher</strong> and are <strong className="text-white">3.2x more likely</strong> to maintain continuous academic progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
