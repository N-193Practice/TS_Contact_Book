import { Contact } from '../models/Contact';
import { Group } from '../models/Group';
import { AppError } from './errors';

// ローカルストレージ用のキー
const CONTACTS_STORAGE_KEY = 'contacts';
const GROUPS_STORAGE_KEY = 'groups';

/**
 * ローカルストレージからデータを取得
 * @param key ローカルストレージのキー
 * @returns {T[]} 取得したデータ（存在しない場合は空配列）
 */
function getFromStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  if (!data) return [];

  try {
    return JSON.parse(data) as T[];
  } catch (error) {
    throw new AppError(
      `Error parsing data from localStorage (key: ${key}): ${
        (error as Error).message
      }`,
      500
    );
  }
}

/**
 * ローカルストレージにデータを保存
 * @param key ローカルストレージのキー
 * @param data 保存するデータ
 */
function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    throw new AppError(
      `Error saving data to localStorage (key: ${key}): ${
        (error as Error).message
      }`,
      500
    );
  }
}

/**
 * ローカルストレージから連絡先を取得
 * @returns {Contact[]} ローカルストレージに保存されている連絡先の配列、または存在しない場合は空の配列。
 */
function getContacts(): Contact[] {
  return getFromStorage<Contact>(CONTACTS_STORAGE_KEY);
}

/**
 * 連絡先をローカルストレージに保存
 * @param {Contact[]} contacts - 保存する連絡先の配列。
 * @returns {void} この関数は値を返さず、ローカルストレージに保存する。
 */
function saveContacts(contacts: Contact[]): void {
  saveToStorage(CONTACTS_STORAGE_KEY, contacts);
}

/**
 * 連絡先を削除する
 * @param {string} id - 削除する連絡先の ID
 * @returns {void} この関数は値を返さず、ローカルストレージに保存する。
 */
function deleteContact(id: string): void {
  const contacts = getContacts();
  const updatedContacts = contacts.filter((contact) => contact.id !== id);

  if (contacts.length === updatedContacts.length) {
    throw new AppError(`Contact with ID ${id} not found`, 404);
  }
  saveContacts(updatedContacts);
}

/**
 * ローカルストレージからグループを取得
 * @returns {Group[]} ローカルストレージに保存されているグループの配列、または存在しない場合は空の配列。
 */
function getGroups(): Group[] {
  return getFromStorage<Group>(GROUPS_STORAGE_KEY);
}

/**
 * グループをローカルストレージに保存
 * @param {Group[]} groups - 保存するグループの配列。
 * @returns {void} この関数は値を返さず、ローカルストレージに保存する。
 */
function saveGroups(groups: Group[]): void {
  saveToStorage(GROUPS_STORAGE_KEY, groups);
}

/**
 * IDでグループを削除し、関連する連絡先の `groupId` をリセット
 * @param {string} id - 削除するグループの ID
 * @returns {void} この関数は値を返さず、グループの削除と連絡先の `groupId` のリセットを行う。
 */
function deleteGroup(id: string): void {
  const groups = getGroups();
  const updatedGroups = groups.filter((group) => group.id !== id);

  if (groups.length === updatedGroups.length) {
    throw new AppError(`Group with ID ${id} not found`, 404);
  }
  saveGroups(updatedGroups);

  resetGroupIdInContacts(id);
}

/**
 * 連絡先内の `groupId` を null にリセット
 * @param {string} groupId - リセットするグループの ID
 * @returns {void} この関数は値を返さず、連絡先の `groupId` をリセットする。
 */
function resetGroupIdInContacts(groupId: string): void {
  const contacts = getContacts();
  let hasUpdated = false;

  const updatedContacts = contacts.map((contact) => {
    if (contact.groupId === groupId) {
      hasUpdated = true;
      return { ...contact, groupId: null };
    }
    return contact;
  });

  if (hasUpdated) {
    saveContacts(updatedContacts);
  }
}

export {
  getContacts,
  saveContacts,
  deleteContact,
  getGroups,
  saveGroups,
  deleteGroup,
  resetGroupIdInContacts,
};
