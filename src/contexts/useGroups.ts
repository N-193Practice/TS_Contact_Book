import { useContext } from 'react';
import { GroupContext, GroupContextType } from './GroupContext';
import { AppError } from '../utils/errors';

function useGroups(): GroupContextType {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new AppError('useGroups must be used within a GroupProvider', 500);
  }
  return context;
}
export default useGroups;
