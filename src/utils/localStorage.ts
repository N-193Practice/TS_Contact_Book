import { CONTACTS_STORAGE_KEY, GROUPS_STORAGE_KEY } from './contacts';
import { v4 as uuidv4 } from 'uuid';
import { Contact } from '../models/types';
import { Group } from '../models/types';
import { AppError } from './errors';

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
 * @returns {void} この関数は値を返さず、ローカルストレージにデータを保存する。
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
 * ローカルストレージから連絡先を取得する。
 * @returns {Contact[]} ローカルストレージに保存されている連絡先の配列、または存在しない場合は空の配列。
 */
function getContacts(): Contact[] {
  return getFromStorage<Contact>(CONTACTS_STORAGE_KEY);
}

/**
 * 連絡先をローカルストレージに保存する。
 * @param {Contact[]} contacts - 保存する連絡先の配列。
 * @returns {void} この関数は値を返さず、ローカルストレージに保存する。
 */
function saveContacts(contacts: Contact[]): void {
  saveToStorage(CONTACTS_STORAGE_KEY, contacts);
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
  return getFromStorage<Group>(GROUPS_STORAGE_KEY);
}

/**
 * グループをローカルストレージに保存する。
 * @param {Group[]} groups - 保存するグループの配列。
 * @returns {void} この関数は値を返さず、ローカルストレージにグループを保存する。
 */
function saveGroups(groups: Group[]): void {
  saveToStorage(GROUPS_STORAGE_KEY, groups);
}

/**
 * グループをローカルストレージに作成する。
 * @param {Group} group - 作成するグループ。
 * @returns {Group} 作成されたグループ。
 */
function createGroup(group: Group): Group {
  const groups = getGroups();
  const newGroup = { ...group, id: uuidv4() };
  saveGroups([...groups, newGroup]);
  return newGroup;
}

/**
 * グループをローカルストレージに保存する。
 * @param {Group} group - 保存するグループ。
 * @returns {void} この関数は値を返さず、ローカルストレージにグループを保存する。
 * @throws {AppError} グループが見つからない場合、エラーをスローする。
 */
function updateGroup(group: Group): void {
  const groups = getGroups();
  const updatedGroups = groups.map((g) => (g.id === group.id ? group : g));
  saveGroups(updatedGroups);
}

/**
 * グループをローカルストレージから削除する。
 * @param {string} id - 削除するグループの ID。
 * @returns {void} この関数は値を返さず、ローカルストレージからグループを削除し、リストを更新する。
 */
function deleteGroup(id: string): void {
  const groups = getGroups();
  const updatedGroups = groups.filter((group) => group.id !== id);

  // グループがない場合は処理を終了する。
  if (groups.length === updatedGroups.length) {
    throw new AppError(`Group with ID ${id} not found`, 404);
  }
  saveGroups(updatedGroups);

  // 連絡先がグループから削除された場合、連絡先のグループIDを nullにする
  resetGroupIdInContacts(id);
}

/**
 * `groupId` を持つ連絡先の groupId を null にする
 * @param {string} groupId - null にする対象のグループ ID
 * @returns {Contact[]} 連絡先の `groupId` をnullに上書きする。
 */
function resetGroupIdInContacts(groupId: string): Contact[] {
  const contacts = getContacts();
  let hasUpdated = false;

  const updatedContacts = contacts.map((contact) => {
    if (String(contact.groupId ?? '').trim() === String(groupId ?? '').trim()) {
      hasUpdated = true;
      return { ...contact, groupId: null }; // null に上書き
    }
    return contact;
  });
  if (hasUpdated) {
    saveContacts(updatedContacts);
  }
  return updatedContacts;
}

export {
  getContacts,
  saveContacts,
  deleteContact,
  getGroups,
  createGroup,
  saveGroups,
  updateGroup,
  deleteGroup,
  resetGroupIdInContacts,
};
