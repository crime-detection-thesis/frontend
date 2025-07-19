import { Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  children: ReactElement;
}

export const NoCenterRoute = ({ children }: Props) => {
  const { userId, surveillanceCenterId, isInitializing } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (surveillanceCenterId) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
