import { Contact } from '../models/Contact';
import { Group } from '../models/Group';
import { AppError } from './errors';

//ローカルストレージに保存されている連絡先、グループのデータを保持するためのキー。
const CONTACTS_STORAGE_KEY = 'contacts';
const GROUPS_STORAGE_KEY = 'groups';

/**
 * ローカルストレージから連絡先を取得する。
 * @returns {Contact[]} ローカルストレージに保存されている連絡先の配列、または存在しない場合は空の配列。
 */
function getContacts(): Contact[] {
  const data = localStorage.getItem(CONTACTS_STORAGE_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch (error) {
    throw new AppError(
      `Error parsing contacts from localStorage: ${(error as Error).message}`,
      500
    );
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
    throw new AppError(
      `Error saving contacts to localStorage: ${(error as Error).message}`,
      500
    );
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

  if (contacts.length === updatedContacts.length) {
    throw new AppError(`Contact with ID ${id} not found`, 404);
  }
  saveContacts(updatedContacts);
}

/**
 * グループをローカルストレージから取得する。
 * @returns {Group[]} この関数はローカルストレージからグループを取得し、それらを返す。
 */
function getGroups(): Group[] {
  const data = localStorage.getItem(GROUPS_STORAGE_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch (error) {
    throw new AppError(
      `Error parsing groups from localStorage: ${(error as Error).message}`,
      500
    );
  }
}

/**
 * グループをローカルストレージに保存する。
 * @param {Group[]} groups - 保存するグループの配列。
 * @returns {void} この関数は値を返さず、ローカルストレージにグループを保存する。
 */
function saveGroups(groups: Group[]): void {
  try {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
  } catch (error) {
    throw new AppError(
      `Error saving groups to localStorage: ${(error as Error).message}`,
      500
    );
  }
}

/**
 * グループをローカルストレージから削除する。
 * @param {string} id - 削除するグループの ID。
 * @returns {void} この関数は値を返さず、ローカルストレージからグループを削除し、リストを更新する。
 */
function deleteGroup(id: string): void {
  const groups = getGroups();
  const updatedGroups = groups.filter((group) => group.id !== id);

  // グループが存在しない場合はエラーを返す
  if (groups.length === updatedGroups.length) {
    throw new AppError(`Group with ID ${id} not found`, 404);
  }
  saveGroups(updatedGroups);

  // 連絡先がグループから削除された場合、グループに所属する連絡先のグループIDを nullにする
  const contacts = getContacts();
  const updatedContacts = contacts.map((contact) =>
    contact.groupId === id ? { ...contact, groupId: null } : contact
  );

  // 連絡先がグループから削除された場合、連絡先のグループIDを nullにする
  if (JSON.stringify(contacts) !== JSON.stringify(updatedContacts)) {
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
};
