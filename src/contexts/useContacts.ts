import { useContext } from 'react';
import { ContactContext, ContactContextType } from './ContactContext';

/**
 * 連絡先のコンテキストを利用するカスタムフック。
 *ContactProvider の内部でない場合にエラーを出す。
 * @returns {object} - 連絡先のコンテキスト。
 */
function useContacts(): ContactContextType {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
}
export { useContacts };
