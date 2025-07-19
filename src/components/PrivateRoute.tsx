import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactElement } from 'react';

interface Props {
    children: ReactElement;
}

export const PrivateRoute = ({ children }: Props) => {
  const { userId, isInitializing } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
