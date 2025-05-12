// src/contexts/RegistrationContext.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';

type PendingUser = { email: string; username: string; password: string };

const RegistrationContext = createContext<{
  pending?: PendingUser;
  setPending: (p: PendingUser) => void;
}>({ pending: undefined, setPending: () => {} });

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({
                                                                          children,
                                                                        }) => {
  const [pending, setPending] = useState<PendingUser>();
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
