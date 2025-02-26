import { useContext } from 'react';
import { ContactContext, ContactContextType } from './ContactContext';
import { AppError } from '../utils/errors';
/**
 * 連絡先のコンテキストを利用するカスタムフック。
 *ContactProvider の内部でない場合にエラーを出す。
 * @returns {object} - 連絡先のコンテキスト。
 */
export function useContacts(): ContactContextType {
  const context = useContext(ContactContext);
  if (!context) {
    throw new AppError(
      'useContacts must be used within a ContactProvider',
      500
    );
  }
  return context;
}
