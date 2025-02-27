import { redirect, type LoaderFunctionArgs } from 'react-router';

import { Contact, Group } from '../models/types';
import {
  getContacts,
  getGroups,
  createGroup,
  deleteGroup,
  updateGroup,
} from './localStorage';

/**
 * 連絡先のデータを取得するための DTO
 * @property {Contact | null} selectedContact - 選択された連絡先
 * @property {Contact[]} contacts - 連絡先のリスト
 */
export interface ContactsDTO {
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
export async function groupAction({
  params,
  request,
}: LoaderFunctionArgs): Promise<Response> {
  const method = request.method?.toString() || null;
  if (!method) {
    throw new Error('Action is required');
  }
  if (method === 'POST') {
    const formData = await request.formData();
    const group: Group = {
      id: formData.get('id')?.toString() || '',
      name: formData.get('name')?.toString() || '',
    };
    createGroup(group);
  } else if (method === 'PATCH') {
    const formData = await request.formData();
    const group: Group = {
      id: formData.get('id')?.toString() || '',
      name: formData.get('name')?.toString() || '',
    };
    updateGroup(group);
  } else if (method === 'DELETE') {
    const groupId = params.id?.toString() || null;
    if (!groupId) {
      throw new Error('Group ID is required');
    }
    deleteGroup(groupId);
  } else {
    throw new Error(`Invalid action: ${method}`);
  }
  return redirect('/groups');
}

/**
 * グループの編集画面に表示するデータ
 *
 * @property {Group} group - 編集対象のグループ
 * @property {Group[]} groups - グループのリスト
 */
export interface GroupDTO {
  group: Group;
  groups: Group[];
}

export function getGroupNew(): GroupDTO {
  const groupDTO: GroupDTO = {
    group: {
      id: '',
      name: '',
    },
    groups: [],
  };
  return groupDTO;
}

/**
 * グループの編集画面に表示するデータを取得する。
 *
 * @param {LoaderFunctionArgs} params - パラメータ
 * @returns {Group} グループのリスト
 */
export function getGroup({ params }: LoaderFunctionArgs): GroupDTO {
  const groupId = params.id?.toString() || null;
  if (!groupId) {
    // 新規作成
    const groupDTO: GroupDTO = {
      group: {
        id: '',
        name: '',
      },
      groups: [],
    };
    return groupDTO;
  }
  const groups = getGroups();
  const group = groups.find((group) => group.id === groupId);
  if (!group) {
    throw new Error(`Group with ID ${groupId} not found`);
  }

  // 編集
  const groupEditDTO: GroupDTO = {
    group: group,
    groups: groups,
  };
  return groupEditDTO;
}
