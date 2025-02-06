import { Contact } from '../models/Contact';
import { Group } from '../models/Group';
import { AppError } from './errors';

// TODO: ローカルストレージの実装
//ローカルストレージに保存されている連絡先、グループのデータを保持するためのキー。
const CONTACTS_STORAGE_KEY = 'contacts';
const GROUPS_STORAGE_KEY = 'groups';

/**
 * ローカルストレージから連絡先を取得する。
 * @returns {Contact[]} ローカルストレージに保存されている連絡先の配列、または存在しない場合は空の配列。
 */
function getContacts(): Contact[] {
  try {
    const data = localStorage.getItem(CONTACTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(
        `Error parsing contacts from localStorage:${error.message}, 500`
      );
    } else {
      throw new AppError(
        'Unknown error parsing contacts from localStorage',
        500
      );
    }
  }
}

/**
 * 連絡先をローカルストレージに保存する。
 * @param {Contact[]} contacts - 保存する連絡先の配列。
 * @returns {void} この関数は値を返さず、ローカルストレージに保存する。
 */
function saveContacts(contacts: Contact[]): void {
  try {
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(
        `Error saving contacts to localStorage:${error.message}, 500`
      );
    } else {
      throw new AppError('Unknown error saving contacts to localStorage', 500);
    }
  }
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

/**
 * グループをローカルストレージから取得する。
 * @returns {Group[]} この関数はローカルストレージからグループを取得し、それらを返す。
 */
function getGroups(): Group[] {
  try {
    const data = localStorage.getItem(GROUPS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(
        `Error parsing groups from localStorage:${error.message}, 500`
      );
    } else {
      throw new AppError('Unknown error parsing groups from localStorage', 500);
    }
  }
}

/**
 * グループをローカルストレージに保存する。
 * @returns {void} この関数は値を返さず、ローカルストレージにグループを保存する。
 */
function saveGroups(groups: Group[]): void {
  try {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(
        `Error saving groups to localStorage:${error.message}, 500`
      );
    } else {
      throw new AppError('Unknown error saving groups to localStorage', 500);
    }
  }
}

/**
 * グループをローカルストレージから削除する。
 * @returns {void} この関数は値を返さず、ローカルストレージからグループを削除し、リストを更新する。
 */
function deleteGroup(id: string): void {
  const groups = getGroups();
  const updatedGroups = groups.filter((group) => group.id !== id);
  saveGroups(updatedGroups);

  // 連絡先がグループから削除された場合、グループに所属する連絡先のグループIDを nullにする
  const contacts = getContacts();
  const updatedContacts = contacts.map((contact) =>
    contact.groupId === id ? { ...contact, groupId: null } : contact
  );
  saveContacts(updatedContacts);
}
export {
  getContacts,
  saveContacts,
  deleteContact,
  getGroups,
  saveGroups,
  deleteGroup,
};
