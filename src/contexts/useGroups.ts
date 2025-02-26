import { useContext } from 'react';
import { GroupContext, GroupContextType } from './GroupContext';
import { AppError } from '../utils/errors';

export function useGroups(): GroupContextType {
  const context = useContext(GroupContext);
  if (!context) {
    throw new AppError('useGroups must be used within a GroupProvider', 500);
  }
  return context;
}
