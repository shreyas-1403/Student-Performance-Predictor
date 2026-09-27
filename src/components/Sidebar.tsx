import React from 'react';

export type NavTab =
  | 'overview-predictions'
  | 'interactive-what-if-simulator'
  | 'feature-importance-insights'
  | 'student-roster-interventions';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  flaggedCount?: number;
}

const navItems: { id: NavTab; label: string; icon: string; badge?: string }[] = [
  { id: 'overview-predictions', label: 'Overview & Predictions', icon: 'insights' },
  { id: 'interactive-what-if-simulator', label: 'What-If Simulator', icon: 'tune' },
  { id: 'feature-importance-insights', label: 'Feature Insights', icon: 'auto_graph' },
  { id: 'student-roster-interventions', label: 'Roster & Interventions', icon: 'group_work' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  flaggedCount = 4,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Header Brand */}
          <div className="h-16 flex items-center px-6 gap-3 border-b border-surface-container/60">
            <img
              alt="EduPredict AI Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VJOaPxaoaBX_VMi9w9iOgVqeQPZNukOCZ2jv96pIXcXT1OfimV_HSKlmncDcK1FnRO0IRkC4P8N9ngMfHHI2BAISIZ__cYdZ_npeRiDHH0ZBAeQoWC0ENOScI4Sjw_kblfgXe8mR21UcW4vTnHBV3ftp-hq878XEhZ7v7IzRu4lQT8Ny2uLHJZAIYMyAcrTABImSqU93gRoQC9w4xtAYvY_v_eowot0cXJ2ayJi_TR8k0u1Jc4ce_BO88"
              onError={(e) => {
                // Graceful fallback to inline vector if network is restricted
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none font-bold">
                EduPredict
              </span>
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Intelligence AI
              </span>
            </div>
            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden ml-auto p-1 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Navigation Section */}
          <div className="px-4 py-4">
            <div className="font-label-sm text-xs uppercase text-outline px-3 mb-2 font-semibold tracking-wider">
              Navigation
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-left transition-all font-body-md text-sm ${
                      isActive
                        ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`material-symbols-outlined text-xl ${
                          isActive ? 'text-white' : 'text-secondary'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.id === 'student-roster-interventions' && flaggedCount > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-error text-white' : 'bg-error-container text-on-error-container'
                        }`}
                      >
                        {flaggedCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* System Telemetry Box at Bottom */}
        <div className="p-3.5 bg-surface-container-low m-3 rounded-lg flex flex-col gap-1 border border-surface-container-high/60">
          <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
            <span className="font-semibold tracking-wider">SYSTEM STATUS</span>
            <span className="h-2 w-2 rounded-full bg-secondary-container animate-pulse"></span>
          </div>
          <div className="text-xs text-on-surface font-bold truncate">
            Prediction Engine Active
          </div>
          <div className="text-[11px] text-on-surface-variant">
            98.8% accuracy · Zero drift
          </div>
        </div>
      </aside>
    </>
  );
};
