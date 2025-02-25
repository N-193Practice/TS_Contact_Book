import { redirect, type LoaderFunctionArgs } from 'react-router';

import { Contact, Group } from '../models/types';
import { getContacts, getGroups, deleteGroup } from './localStorage';

/**
 * 連絡先のデータを取得するための DTO
 * @property {Contact | null} selectedContact - 選択された連絡先
 * @property {Contact[]} contacts - 連絡先のリスト
 */
interface ContactsDTO {
  selectedContact: Contact | null;
  contacts: Contact[];
  groups: Group[];
}

/**
 * 連絡先のリストを取得する。
 * @returns {ContactsDTO} 連絡先のリスト
 */
export function getContactsList(): ContactsDTO {
  const contacts = getContacts();
  const contactsDTO: ContactsDTO = {
    selectedContact: null,
    contacts: contacts,
    groups: [],
  };

  return contactsDTO;
}

/**
 * 連絡先の編集画面に表示するデータを取得する。
 * @param {LoaderFunctionArgs} params - パラメータ
 * @returns {ContactsDTO} 連絡先のリスト
 */
export function getContactsEdit({ params }: LoaderFunctionArgs): ContactsDTO {
  const selectedContactId = params.id?.toString() || null;
  const contacts = getContacts();
  const groups = getGroups();
  const selectedContact =
    contacts.find((contact) => contact.id === selectedContactId) || null;

  if (!selectedContact) {
    throw new Error(`Contact with ID ${selectedContactId} not found`);
  }

  const contactsDTO: ContactsDTO = {
    selectedContact: selectedContact,
    contacts: contacts,
    groups: groups,
  };

  return contactsDTO;
}

/**
 * 新規連絡先のデータを取得する。
 * @returns {ContactsDTO} 連絡先のリスト
 */
export function getContactsNew(): ContactsDTO {
  const contacts = getContacts();
  const groups = getGroups();

  const contactsDTO: ContactsDTO = {
    selectedContact: {
      id: '',
      name: '',
      phone: '',
      memo: '',
      groupId: null,
    },
    contacts: contacts,
    groups: groups,
  };

  return contactsDTO;
}

/**
 * グループのリストを取得する。
 *
 * @returns {Group[]} グループのリスト
 */
export function getGroupsList(): Group[] {
  const groups = getGroups();
  return groups;
}

/**
 * グループの新規作成画面に表示するデータを取得する。
 *
 * @returns {Group} グループのリスト
 */
export function groupAction({ params }: LoaderFunctionArgs): Response {
  const groupId = params.id?.toString() || null;
  if (!groupId) {
    throw new Error('Group ID is required');
  }
  deleteGroup(groupId);
  return redirect('/groups');
}

/**
 * グループの編集画面に表示するデータ
 *
 * @property {Group} group - 編集対象のグループ
 * @property {Group[]} groups - グループのリスト
 */
interface GroupEditDTO {
  group: Group;
  groups: Group[];
}

/**
 * グループの編集画面に表示するデータを取得する。
 *
 * @param {LoaderFunctionArgs} params - パラメータ
 * @returns {Group} グループのリスト
 */
export function getGroupEdit({ params }: LoaderFunctionArgs): GroupEditDTO {
  const groupId = params.id?.toString() || null;
  if (!groupId) {
    throw new Error('Group ID is required');
  }
  const groups = getGroups();
  const group = groups.find((group) => group.id === groupId);
  if (!group) {
    throw new Error(`Group with ID ${groupId} not found`);
  }

  const groupEditDTO: GroupEditDTO = {
    group: group,
    groups: groups,
  };
  return groupEditDTO;
}
