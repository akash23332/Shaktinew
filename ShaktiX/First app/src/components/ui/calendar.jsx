import React from 'react';

// Minimal placeholder calendar that renders a native date input for now
const Calendar = ({ selected, onSelect, className = '' }) => {
  const value = selected instanceof Date ? selected.toISOString().slice(0, 10) : '';
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onSelect && onSelect(e.target.value ? new Date(e.target.value) : undefined)}
      className={className}
    />
  );
};

export { Calendar };
