import React from 'react';

const Progress = ({ value = 0, className = '' }) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full overflow-hidden rounded-full bg-muted ${className}`}>
      <div className="h-full bg-primary" style={{ width: `${clamped}%`, height: '100%' }} />
    </div>
  );
};

export { Progress };
