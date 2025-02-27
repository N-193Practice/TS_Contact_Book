import { useContext } from 'react';
import { GroupContext, GroupContextType } from './GroupContext';
import { AppError } from '../utils/errors';

/**
 * グループのコンテキストを利用するカスタムフック。
 * GroupProvider の内部でない場合にエラーを出す。
 * @returns {object} - グループのコンテキスト。
 * */
export function useGroups(): GroupContextType {
  const context = useContext(GroupContext);
  if (!context) {
    throw new AppError('useGroups must be used within a GroupProvider', 500);
  }
  return context;
}
