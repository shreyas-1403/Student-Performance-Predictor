/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewScreen } from './views/OverviewScreen';
import { WhatIfSimulatorScreen } from './views/WhatIfSimulatorScreen';
import { FeatureInsightsScreen } from './views/FeatureInsightsScreen';
import { RosterScreen } from './views/RosterScreen';
import { StudentDetailDrawer } from './components/StudentDetailDrawer';
import { InterventionModal } from './components/InterventionModal';
import { FormalReportModal } from './components/FormalReportModal';
import { ExportWeightsModal } from './components/ExportWeightsModal';
import { NotificationsPopover } from './components/NotificationsPopover';
import { CommandPalette } from './components/CommandPalette';
import { HelpMathModal } from './components/HelpMathModal';
import { INITIAL_STUDENTS, INITIAL_INTERVENTIONS } from './data/studentsData';
import { Student, SavedSimulation, InterventionRecord } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview-predictions');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState('all');

  // Application Data States
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [, setInterventions] = useState<InterventionRecord[]>(INITIAL_INTERVENTIONS);
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([
    {
      id: 'SIM-1001',
      name: 'Baseline Guided Problem Session (+2h)',
      timestamp: 'Today, 08:30 AM',
      params: {
        hoursStudied: 6,
        previousScore: 65,
        extracurricular: true,
        sleepHours: 7,
        papersPracticed: 3,
      },
      predictedScore: 68.4,
      grade: 'GRADE: B',
      bayesRisk: 6.2,
      delta: 13.2,
    },
    {
      id: 'SIM-1002',
      name: 'Sleep Wellness Calibration (>7h)',
      timestamp: 'Yesterday, 14:15 PM',
      params: {
        hoursStudied: 5,
        previousScore: 50,
        extracurricular: false,
        sleepHours: 8,
        papersPracticed: 2,
      },
      predictedScore: 49.8,
      grade: 'GRADE: C',
      bayesRisk: 31.4,
      delta: -5.4,
    },
  ]);

  // Modal / Drawer States
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [interventionStudent, setInterventionStudent] = useState<Student | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [formalReportOpen, setFormalReportOpen] = useState(false);
  const [exportWeightsOpen, setExportWeightsOpen] = useState(false);
  const [helpMathOpen, setHelpMathOpen] = useState(false);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard shortcut for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveSimulation = (sim: SavedSimulation) => {
    setSavedSimulations((prev) => [sim, ...prev]);
    showToast(`Simulation "${sim.name}" saved to library.`);
  };

  const handleDeleteSimulation = (id: string) => {
    setSavedSimulations((prev) => prev.filter((s) => s.id !== id));
    showToast('Simulation removed from library.');
  };

  const handleTriggerIntervention = (st: Student) => {
    setInterventionStudent(st);
  };

  const handleSubmitIntervention = (record: InterventionRecord) => {
    setInterventions((prev) => [record, ...prev]);

    // Update student flag in state
    setStudents((prev) =>
      prev.map((s) =>
        s.id === record.studentId
          ? {
              ...s,
              status: s.status === 'Critical Support' ? 'Needs Review' : s.status,
              notes: `${s.notes ? s.notes + ' | ' : ''}Active intervention deployed: ${record.type} (${record.date})`,
              probationRisk: Math.max(10, s.probationRisk - 25),
            }
          : s
      )
    );

    showToast(`Intervention dispatched for ${record.studentName} (${record.type}).`);
  };

  // Filter students based on global cohort selector in header
  const visibleStudents =
    selectedCohort === 'all'
      ? students
      : students.filter((s) => s.cohort === selectedCohort);

  const flaggedCount = visibleStudents.filter(
    (s) => s.interventionFlag || s.status === 'Critical Support'
  ).length;

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-bounce">
          <span className="material-symbols-outlined text-base text-tertiary-fixed">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        flaggedCount={flaggedCount}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
          onOpenHelp={() => setHelpMathOpen(true)}
          onOpenExportModal={() => setExportWeightsOpen(true)}
          onOpenReportModal={() => setFormalReportOpen(true)}
          selectedCohort={selectedCohort}
          onChangeCohort={setSelectedCohort}
          notificationCount={flaggedCount}
        />

        {/* Content Canvas */}
        <main className="relative pt-20 w-full px-4 sm:px-6 lg:px-space-xl bg-surface min-h-screen">
          {activeTab === 'overview-predictions' && (
            <OverviewScreen
              students={visibleStudents}
              onNavigateToRoster={() => setActiveTab('student-roster-interventions')}
              onSaveSimulation={handleSaveSimulation}
              onSelectStudent={setSelectedStudent}
            />
          )}

          {activeTab === 'interactive-what-if-simulator' && (
            <WhatIfSimulatorScreen
              savedSimulations={savedSimulations}
              onSaveSimulation={handleSaveSimulation}
              onDeleteSimulation={handleDeleteSimulation}
            />
          )}

          {activeTab === 'feature-importance-insights' && <FeatureInsightsScreen />}

          {activeTab === 'student-roster-interventions' && (
            <RosterScreen
              students={visibleStudents}
              onSelectStudent={setSelectedStudent}
              onTriggerIntervention={handleTriggerIntervention}
            />
          )}
        </main>
      </div>

      {/* Student Details Slide-out Drawer */}
      <StudentDetailDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onTriggerIntervention={handleTriggerIntervention}
      />

      {/* Intervention Modal */}
      <InterventionModal
        student={interventionStudent}
        onClose={() => setInterventionStudent(null)}
        onSubmitIntervention={handleSubmitIntervention}
      />

      {/* Formal Report Modal */}
      <FormalReportModal
        isOpen={formalReportOpen}
        onClose={() => setFormalReportOpen(false)}
      />

      {/* Export Model Weights Modal */}
      <ExportWeightsModal
        isOpen={exportWeightsOpen}
        onClose={() => setExportWeightsOpen(false)}
      />

      {/* Notifications Popover */}
      <NotificationsPopover
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        students={visibleStudents}
        onSelectStudent={setSelectedStudent}
        onTriggerIntervention={handleTriggerIntervention}
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
        students={visibleStudents}
        onSelectStudent={setSelectedStudent}
        onOpenReportModal={() => setFormalReportOpen(true)}
        onOpenExportModal={() => setExportWeightsOpen(true)}
      />

      {/* Mathematical Guide Modal */}
      <HelpMathModal
        isOpen={helpMathOpen}
        onClose={() => setHelpMathOpen(false)}
      />
    </div>
  );
}
