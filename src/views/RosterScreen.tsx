import React, { useState } from 'react';
import { Student } from '../types';

interface RosterScreenProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onTriggerIntervention: (student: Student) => void;
}

export const RosterScreen: React.FC<RosterScreenProps> = ({
  students,
  onSelectStudent,
  onTriggerIntervention,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cohortFilter, setCohortFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Student>('predictedScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchNoticeSent, setBatchNoticeSent] = useState(false);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCohort = cohortFilter === 'all' || s.cohort === cohortFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

    return matchesSearch && matchesCohort && matchesStatus;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') {
      return sortAsc
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    }

    if (typeof valA === 'boolean') {
      valA = valA ? 1 : 0;
      valB = (valB as boolean) ? 1 : 0;
    }

    return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
  });

  const toggleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(sortedStudents.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const exportCsv = () => {
    const headers = ['Student ID', 'Name', 'Cohort', 'Hours', 'Prev Score', 'EC', 'Sleep', 'Papers', 'Actual', 'Predicted', 'Residual', 'Status', 'Risk %'];
    const rows = sortedStudents.map((s) => [
      s.id,
      s.name,
      s.cohort,
      s.hoursStudied,
      s.previousScore,
      s.extracurricular ? 'Yes' : 'No',
      s.sleepHours,
      s.papersPracticed,
      s.actualScore,
      s.predictedScore,
      s.residual,
      s.status,
      s.probationRisk,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduPredict_Student_Roster_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendBatchNotice = () => {
    setBatchNoticeSent(true);
    setTimeout(() => {
      setBatchNoticeSent(false);
      setSelectedIds([]);
    }, 2500);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Student Roster &amp; Interventions
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
            Browse enrolled student records, evaluate individual risk scores, and deploy academic support plans.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.length > 0 && (
            <button
              onClick={handleSendBatchNotice}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-error text-white rounded-lg hover:bg-error/90 font-label-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">mark_email_unread</span>
              <span>
                {batchNoticeSent ? '✓ Notices Dispatched!' : `Send Batch Notice (${selectedIds.length})`}
              </span>
            </button>
          )}

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest text-on-surface rounded-lg hover:bg-surface-container font-label-md text-xs font-semibold border border-surface-container-high shadow-2xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-secondary">file_download</span>
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container-high/70 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <span className="material-symbols-outlined text-outline text-lg">search</span>
          <input
            type="text"
            placeholder="Search by student name, ID (#STU-...), or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent font-body-sm text-sm text-on-surface focus:outline-none placeholder:text-outline"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Cohort filter */}
          <div className="flex items-center bg-surface-container-low rounded-lg px-2.5 py-1 gap-1.5 border border-surface-container-high">
            <span className="text-xs text-outline font-semibold">Cohort:</span>
            <select
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
              className="bg-transparent font-label-md text-xs text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="all">All Cohorts</option>
              <option value="Fall Cohort">Fall Cohort</option>
              <option value="STEM Honors">STEM Honors</option>
              <option value="At-Risk Cohort">At-Risk Cohort</option>
              <option value="Freshman Cohort">Freshman Cohort</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center bg-surface-container-low rounded-lg px-2.5 py-1 gap-1.5 border border-surface-container-high">
            <span className="text-xs text-outline font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-label-md text-xs text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="High Performer">High Performer</option>
              <option value="On Track">On Track</option>
              <option value="Needs Review">Needs Review</option>
              <option value="Critical Support">Critical Support</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-sm text-on-surface border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-outline font-label-sm text-xs tracking-wider uppercase border-b border-surface-container-high select-none">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={sortedStudents.length > 0 && selectedIds.length === sortedStudents.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="accent-secondary cursor-pointer"
                  />
                </th>
                <th
                  onClick={() => toggleSort('id')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-on-surface"
                >
                  Student ID {sortField === 'id' && (sortAsc ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-on-surface"
                >
                  Name &amp; Cohort {sortField === 'name' && (sortAsc ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => toggleSort('hoursStudied')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-on-surface"
                >
                  Hours {sortField === 'hoursStudied' && (sortAsc ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => toggleSort('previousScore')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-on-surface"
                >
                  Prev Score {sortField === 'previousScore' && (sortAsc ? '↑' : '↓')}
                </th>
                <th className="py-3 px-3 font-semibold">EC</th>
                <th className="py-3 px-3 font-semibold">Sleep</th>
                <th className="py-3 px-3 font-semibold">Papers</th>
                <th
                  onClick={() => toggleSort('predictedScore')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-on-surface text-primary bg-surface-container/60"
                >
                  Predicted {sortField === 'predictedScore' && (sortAsc ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => toggleSort('probationRisk')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-on-surface"
                >
                  Bayes Risk {sortField === 'probationRisk' && (sortAsc ? '↑' : '↓')}
                </th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40">
              {sortedStudents.map((st) => {
                const isSelected = selectedIds.includes(st.id);
                return (
                  <tr
                    key={st.id}
                    className={`hover:bg-surface-container-low/80 transition-colors ${
                      st.status === 'Critical Support' ? 'bg-error-container/10' : ''
                    } ${isSelected ? 'bg-secondary/5' : ''}`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(st.id)}
                        className="accent-secondary cursor-pointer"
                      />
                    </td>
                    <td
                      onClick={() => onSelectStudent(st)}
                      className="py-3 px-3 font-mono font-semibold text-primary cursor-pointer hover:underline"
                    >
                      {st.id}
                    </td>
                    <td onClick={() => onSelectStudent(st)} className="py-3 px-3 cursor-pointer">
                      <div className="font-semibold text-on-surface">{st.name}</div>
                      <div className="text-[11px] text-outline font-mono">{st.cohort}</div>
                    </td>
                    <td className="py-3 px-3 font-medium">{st.hoursStudied}h</td>
                    <td className="py-3 px-3 font-medium">{st.previousScore}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded font-label-sm text-[11px] font-semibold ${
                          st.extracurricular
                            ? 'bg-surface-container text-tertiary-container'
                            : 'bg-surface-container-high text-outline'
                        }`}
                      >
                        {st.extracurricular ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3 px-3">{st.sleepHours}h</td>
                    <td className="py-3 px-3">{st.papersPracticed}</td>
                    <td className="py-3 px-3 font-bold bg-surface-container/40 text-primary">
                      {st.predictedScore.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 font-mono text-xs">
                      <span className={st.probationRisk >= 50 ? 'text-error font-bold' : 'text-on-surface-variant'}>
                        {st.probationRisk}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {st.status === 'High Performer' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-xs bg-surface-container text-tertiary-container font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>High
                        </span>
                      )}
                      {st.status === 'On Track' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-xs bg-surface-container-high text-secondary font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>On Track
                        </span>
                      )}
                      {st.status === 'Needs Review' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-xs bg-surface-container-high text-on-surface-variant font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>Review
                        </span>
                      )}
                      {st.status === 'Critical Support' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-xs bg-error-container text-on-error-container font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>Critical
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onTriggerIntervention(st)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                          st.interventionFlag
                            ? 'bg-error text-white hover:bg-error/90 shadow-2xs'
                            : 'bg-surface-container text-primary hover:bg-surface-container-high'
                        }`}
                      >
                        {st.interventionFlag ? 'Intervene Now' : 'Plan Action'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-surface-container-low flex justify-between items-center text-xs text-on-surface-variant border-t border-surface-container-high">
          <span>
            Showing <strong className="text-on-surface">{sortedStudents.length}</strong> of{' '}
            <strong className="text-on-surface">{students.length}</strong> loaded student records
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-outline">Dataset: 1,000 empirical samples in posterior cache</span>
          </div>
        </div>
      </div>
    </div>
  );
};
