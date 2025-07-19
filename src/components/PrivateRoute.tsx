import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactElement } from 'react';

interface Props {
  children: ReactElement;
}

export const PrivateRoute = ({ children }: Props) => {
  const { userId, surveillanceCenterId, isInitializing } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (!surveillanceCenterId) {
    return <Navigate to="/select-surveillance-center" replace />;
  }

  return children;
};
