import Contact from '../models/Contact';

//ローカルストレージに保存されている連絡先のデータを保持するためのキー。
const STORAGE_KEY = 'contacts';

/**
 * ローカルストレージから連絡先を取得する。
 * @returns {Contact[]} ローカルストレージに保存されている連絡先の配列、または存在しない場合は空の配列。
 */
function getContacts(): Contact[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * 連絡先をローカルストレージに保存する。
 * @param {Contact[]} contacts - 保存する連絡先の配列。
 * @returns {void} この関数は値を返さず、ローカルストレージに保存する。
 */
function saveContacts(contacts: Contact[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

/**
 * ローカルストレージから ID で連絡先を削除する。
 * @param {string} id - 削除する連絡先の ID。
 * @returns {void} この関数は値を返さず、ローカルストレージから連絡先を削除し、リストを更新する。
 */
function deleteContact(id: string): void {
  const contacts = getContacts();
  const updatedContacts = contacts.filter((contact) => contact.id !== id);
  saveContacts(updatedContacts);
}
export { getContacts, saveContacts, deleteContact };
