import React from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function AdminOnly({ children, fallback = null }) {
  const { isAdmin } = useAuthContext();

  if (!isAdmin) {
    return fallback;
  }

  return <>{children}</>;
}
