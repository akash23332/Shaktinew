import React, { useEffect } from 'react';

const DialogContext = React.createContext({ open: false, setOpen: () => {} });

const Dialog = ({ open, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = React.useState(!!open);
  useEffect(() => { if (open !== undefined) setInternalOpen(open); }, [open]);
  const setOpen = (v) => {
    setInternalOpen(v);
    onOpenChange && onOpenChange(v);
  };
  return (
    <DialogContext.Provider value={{ open: internalOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ asChild, children }) => (
  <DialogContext.Consumer>
    {({ setOpen }) => (
      asChild && React.isValidElement(children) ? (
        React.cloneElement(children, { onClick: () => setOpen(true) })
      ) : (
        <button onClick={() => setOpen(true)}>{children}</button>
      )
    )}
  </DialogContext.Consumer>
);

const DialogContent = ({ className = '', children }) => (
  <DialogContext.Consumer>
    {({ open, setOpen }) => open ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)}></div>
        <div className={`relative z-10 w-full max-w-lg rounded-lg bg-background p-6 shadow-lg ${className}`}>
          {children}
        </div>
      </div>
    ) : null}
  </DialogContext.Consumer>
);

const DialogHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);
const DialogTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);
const DialogDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription };
