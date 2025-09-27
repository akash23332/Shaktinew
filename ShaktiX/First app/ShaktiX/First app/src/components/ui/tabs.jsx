import React, { useState } from 'react';

const TabsContext = React.createContext({ value: '', setValue: () => {} });

const Tabs = ({ defaultValue, value: controlledValue, onValueChange, className = '', children }) => {
  const [uncontrolled, setUncontrolled] = useState(defaultValue || '');
  const value = controlledValue !== undefined ? controlledValue : uncontrolled;
  const setValue = (v) => {
    setUncontrolled(v);
    onValueChange && onValueChange(v);
  };
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className = '', children }) => (
  <div className={`inline-grid rounded-md bg-muted p-1 ${className}`}>{children}</div>
);

const TabsTrigger = ({ value, children, className = '' }) => (
  <TabsContext.Consumer>
    {({ value: active, setValue }) => (
      <button
        className={`px-3 py-1.5 text-sm rounded-md ${active === value ? 'bg-background shadow' : 'opacity-70 hover:opacity-100'} ${className}`}
        onClick={() => setValue(value)}
        type="button"
      >
        {children}
      </button>
    )}
  </TabsContext.Consumer>
);

const TabsContent = ({ value, children, className = '' }) => (
  <TabsContext.Consumer>
    {({ value: active }) => (active === value ? <div className={className}>{children}</div> : null)}
  </TabsContext.Consumer>
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
