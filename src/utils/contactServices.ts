import { redirect, type LoaderFunctionArgs } from 'react-router';
import Papa from 'papaparse';

import { Contact, Group, CSVContact } from '../models/types';
import { csvToContact } from './csvConverter';
import {
  getContacts,
  getGroups,
  createContact,
  deleteContact,
  updateContact,
  createGroup,
  deleteGroup,
  updateGroup,
} from './localStorage';
import { AppError } from './errors';
import { validateContact, validateCSVRow } from '../utils/validation';

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
  const groups = getGroups();
  const contactsDTO: ContactsDTO = {
    selectedContact: null,
    contacts: contacts,
    groups: groups,
  };

  return contactsDTO;
}

export async function contactsAction({
  request,
}: LoaderFunctionArgs): Promise<Response> {
  const method = request.method?.toString() || null;
  if (!method) {
    throw new AppError('Action is required');
  }
  if (method === 'POST') {
    const contact: Contact = await request.json();
    const isValid = validateContact(contact);
    if (!isValid) {
      return redirect('/contacts/new');
    }
    createContact(contact);
  } else if (method === 'PATCH') {
    const contact: Contact = await request.json();
    const isValid = validateContact(contact);
    if (!isValid) {
      return redirect(`/contacts/edit/${contact.id}/edit`);
    }
    updateContact(contact);
  } else if (method === 'DELETE') {
    const formData = await request.formData();
    const contactId = formData.get('id')?.toString() || null;
    if (!contactId) {
      throw new AppError('Contact ID is required');
    }
    deleteContact(contactId);
  } else {
    throw new AppError(`Invalid action: ${method}`);
  }
  return redirect('/');
}

export async function importContacts({
  request,
}: LoaderFunctionArgs): Promise<Response> {
  const formData = await request.formData();
  const fileContent = formData.get('fileContent');
  if (!fileContent) {
    throw new AppError('File content is required');
  }

  try {
    const parsedData = Papa.parse(fileContent as string, { header: true });
    const csvContacts = parsedData.data as CSVContact[];
    const existingContacts = getContacts();
    const existingGroups = getGroups();

    // バリデーション実行
    for (const row of csvContacts) {
      if (
        !validateCSVRow(row, existingContacts, (message) => {
          throw new AppError(message);
        })
      ) {
        return new Response(null, { status: 400 }); // バリデーションエラー時はエラーを返す
      }
    }

    const newContacts = csvContacts.map((csvContact) =>
      csvToContact(csvContact, existingContacts, existingGroups, createGroup)
    );

    newContacts.forEach((contact) => {
      if (contact.id || contact.id !== '') {
        updateContact(contact);
      } else {
        createContact(contact);
      }
    });

    return redirect('/');
  } catch (error: unknown) {
    throw new AppError('Error processing file' + (error as Error).message);
  }
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
    throw new AppError(`Contact with ID ${selectedContactId} not found`);
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
    throw new AppError('Action is required');
  }
  if (method === 'POST') {
    const formData = await request.formData();

    const name: string = formData.get('name')?.toString() || '';
    createGroup(name);
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
      throw new AppError('Group ID is required');
    }
    deleteGroup(groupId);
  } else {
    throw new AppError(`Invalid action: ${method}`);
  }
  return new Response(null, { status: 200 });
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
    throw new AppError(`Group with ID ${groupId} not found`);
  }

  // 編集
  const groupEditDTO: GroupDTO = {
    group: group,
    groups: groups,
  };
  return groupEditDTO;
}
