"use client";

import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/types/application";

export function StatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: ApplicationStatus;
  onChange: (value: ApplicationStatus) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as ApplicationStatus)}
      className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 disabled:opacity-60"
    >
      {APPLICATION_STATUSES.map((status) => (
        <option key={status} value={status}>
          {APPLICATION_STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
