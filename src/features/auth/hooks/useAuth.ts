/**
 * useAuth hook - provides access to authentication context
 * This is a convenience hook that wraps useAuthContext
 */

import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};
