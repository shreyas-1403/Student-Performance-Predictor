import React from 'react';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
  onOpenNotifications: () => void;
  onOpenHelp: () => void;
  onOpenExportModal: () => void;
  onOpenReportModal: () => void;
  selectedCohort: string;
  onChangeCohort: (cohort: string) => void;
  notificationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onOpenCommandPalette,
  onOpenNotifications,
  onOpenHelp,
  onOpenExportModal,
  onOpenReportModal,
  selectedCohort,
  onChangeCohort,
  notificationCount,
}) => {
  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-xl shadow-xs z-40 flex items-center justify-between px-4 lg:px-6 border-b border-surface-container-high/60">
      {/* Mobile menu trigger */}
      <button
        onClick={onOpenMobileSidebar}
        className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined text-xl">menu</span>
      </button>

      {/* Left zone: Academic breadcrumbs & search */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
        <div className="hidden sm:flex items-center gap-2 text-on-surface-variant font-body-sm text-sm shrink-0">
          <span className="material-symbols-outlined text-lg text-secondary">school</span>
          <span>Academic Year 2024-2025</span>
          <span className="text-outline-variant">/</span>
          <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
            Fall Cohort
          </span>
        </div>

        {/* Quick Search with ⌘K */}
        <div
          onClick={onOpenCommandPalette}
          className="relative flex-1 max-w-xs cursor-pointer group"
        >
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-lg text-outline group-hover:text-primary transition-colors">
            search
          </span>
          <input
            readOnly
            className="w-full pl-9 pr-12 py-1.5 bg-surface-container-low rounded-lg font-body-sm text-sm text-on-surface placeholder:text-outline cursor-pointer focus:outline-none group-hover:bg-surface-container transition-colors border border-transparent group-hover:border-surface-container-high"
            placeholder="Search student or metrics..."
            type="text"
          />
          <span className="absolute right-2.5 top-2 font-label-sm text-[10px] text-outline px-1.5 py-0.5 rounded bg-surface-container font-mono border border-surface-container-highest">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right zone: Actions, Cohort Selector, Notification, Profile */}
      <div className="flex items-center gap-2 lg:gap-3 shrink-0">
        {/* Cohort Selector */}
        <div className="hidden md:flex items-center bg-surface-container-low rounded-lg px-2.5 py-1 gap-2 border border-surface-container-high/50">
          <span className="material-symbols-outlined text-base text-secondary">filter_alt</span>
          <select
            value={selectedCohort}
            onChange={(e) => onChangeCohort(e.target.value)}
            className="bg-transparent font-label-md text-xs lg:text-sm text-on-surface focus:outline-none cursor-pointer"
          >
            <option value="all">All Students (10,000+)</option>
            <option value="At-Risk Cohort">At-Risk Cohort</option>
            <option value="STEM Honors">STEM Honors</option>
            <option value="Freshman Cohort">Freshman Cohort</option>
          </select>
        </div>

        {/* Quick Export & Report Actions */}
        <button
          onClick={onOpenReportModal}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary rounded-lg hover:bg-primary-container font-label-md text-xs font-semibold transition-colors shadow-2xs"
          type="button"
        >
          <span className="material-symbols-outlined text-sm">description</span>
          <span>Formal Report</span>
        </button>

        <button
          onClick={onOpenExportModal}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-container-low text-on-surface rounded-lg hover:bg-surface-container font-label-md text-xs font-semibold transition-colors border border-surface-container-high"
          type="button"
          title="Export Model Weights"
        >
          <span className="material-symbols-outlined text-sm text-secondary">download</span>
          <span>Export</span>
        </button>

        {/* Notifications button with badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          type="button"
          title={`${notificationCount} students flagged for intervention`}
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-error text-on-error font-label-sm text-[10px] font-bold leading-none shadow-xs">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Help button */}
        <button
          onClick={onOpenHelp}
          className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          type="button"
          title="Guide & Information"
        >
          <span className="material-symbols-outlined text-xl">help_outline</span>
        </button>

        {/* Profile lockup */}
        <div className="flex items-center gap-2 lg:gap-3 pl-2 border-l border-surface-container-high">
          <img
            alt="Dr. Shanyu Sai Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container-highest"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VaOIXlUGYAHAyksAxYHj5D5lEBk-3YO4-gtt13KSfshrPI25f5GvsNaa6qsJQmBhVfNbLAs2-8qX1857qUsggs6u69puzFWaCaWEZ35GjXsgqBF2YeTtVDG8tm56ctLm__16dlQzHgCzRxlSe5rS_wnj-0TA9VScl1hsnp0ssrRUsoQRr5DNzVr-r-6MG3nQ1M3_0i93adD8wYGDQjlt4hP1AM1yFlKC_z4rtapr7atFBRLRjrFMwuXEA"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-label-md text-xs lg:text-sm text-on-surface font-semibold leading-tight">
              Dr. Shanyu Sai
            </span>
            <span className="font-body-sm text-[11px] text-on-surface-variant leading-tight">
              Lead Academic Advisor
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
