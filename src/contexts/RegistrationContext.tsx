// src/contexts/RegistrationContext.tsx
import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

type PendingUser = { email: string; username: string; password: string };

const RegistrationContext = createContext<{
  pending?: PendingUser;
  setPending: (p: PendingUser | undefined) => void;
}>({ 
  pending: undefined, 
  setPending: () => {}
});

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pending, setPending] = useState<PendingUser | undefined>(undefined);

  return (
    <RegistrationContext.Provider value={{ pending, setPending }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error('useRegistration debe usarse dentro de RegistrationProvider');
  return ctx;
};
