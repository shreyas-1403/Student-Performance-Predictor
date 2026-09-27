export interface Student {
  id: string;
  name: string;
  email: string;
  cohort: 'Fall Cohort' | 'STEM Honors' | 'At-Risk Cohort' | 'Freshman Cohort';
  hoursStudied: number;
  previousScore: number;
  extracurricular: boolean;
  sleepHours: number;
  papersPracticed: number;
  actualScore: number;
  predictedScore: number;
  residual: number;
  status: 'High Performer' | 'On Track' | 'Needs Review' | 'Critical Support';
  probationRisk: number; // percentage 0-100
  interventionFlag?: boolean;
  notes?: string;
  lastUpdated?: string;
}

export interface SimulationParams {
  hoursStudied: number;
  previousScore: number;
  extracurricular: boolean;
  sleepHours: number;
  papersPracticed: number;
}

export interface SavedSimulation {
  id: string;
  name: string;
  timestamp: string;
  params: SimulationParams;
  predictedScore: number;
  grade: string;
  bayesRisk: number;
  delta: number;
}

export interface ModelComplexityConfig {
  degree: number;
  lambdaLog: number;
  name: string;
  description: string;
  trainRms: number;
  testRms: number;
  overfitWarning?: boolean;
}

export interface InterventionRecord {
  id: string;
  studentId: string;
  studentName: string;
  type: 'Tutoring Session' | 'Sleep & Wellness Plan' | 'Academic Probation Review' | 'Study Hall Assignment';
  date: string;
  advisor: string;
  status: 'Pending' | 'Active' | 'Resolved';
  actionSummary: string;
}
