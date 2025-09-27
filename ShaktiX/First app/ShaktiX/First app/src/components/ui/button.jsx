import React from 'react';

const Button = ({ children, className = '', variant = 'default', size = 'md', asChild, ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-primary text-primary-foreground hover:opacity-90',
    outline: 'border border-input bg-transparent hover:bg-muted',
    ghost: 'bg-transparent hover:bg-muted',
    gradient: 'bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90'
  };
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-11 px-6 text-base'
  };

  const classNames = `${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { className: `${children.props.className || ''} ${classNames}`, ...props });
  }

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
};

export { Button };
