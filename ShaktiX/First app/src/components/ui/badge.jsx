import React from 'react';

const Badge = ({ className = '', variant = 'default', children }) => {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-border',
    destructive: 'bg-destructive text-destructive-foreground'
  };
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
  return <span className={`${base} ${variants[variant] || variants.default} ${className}`}>{children}</span>;
};

export { Badge };
