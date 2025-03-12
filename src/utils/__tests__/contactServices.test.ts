import { describe, it, expect, beforeEach } from 'vitest';
import {
  getContactsList,
  getContactsNew,
  getGroupsList,
  groupAction,
  getGroupNew,
} from '../contactServices';
import { Contact, Group } from '../../models/types';

describe('contactServices', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getContactsList', () => {
    it('データが存在しない場合、空の連絡先とグループを返す', () => {
      expect(getContactsList()).toEqual({
        selectedContact: null,
        contacts: [],
        groups: [],
      });
    });

    it('localStorage から連絡先を返す', () => {
      const mockContacts: Contact[] = [
        {
          id: '1',
          name: 'John Doe',
          phone: '123-456',
          memo: '',
          groupId: null,
        },
      ];
      const mockGroups: Group[] = [{ id: '101', name: 'Friends' }];
      localStorage.setItem('contacts', JSON.stringify(mockContacts));
      localStorage.setItem('groups', JSON.stringify(mockGroups));

      expect(getContactsList()).toEqual({
        selectedContact: null,
        contacts: mockContacts,
        groups: mockGroups,
      });
    });

    it('選択された連絡先が存在する場合、その連絡先を返す', () => {
      const mockContacts: Contact[] = [
        {
          id: '1',
          name: 'John Doe',
          phone: '123-456',
          memo: '',
          groupId: null,
        },
        {
          id: '2',
          name: 'Jane Doe',
          phone: '789-012',
          memo: '',
          groupId: null,
        },
      ];
      const mockGroups: Group[] = [{ id: '101', name: 'Friends' }];
      localStorage.setItem('contacts', JSON.stringify(mockContacts));
      localStorage.setItem('groups', JSON.stringify(mockGroups));

      const selectedContactId = '2';
      const result = getContactsList();
      result.selectedContact =
        mockContacts.find((contact) => contact.id === selectedContactId) ||
        null;

      expect(result).toEqual({
        selectedContact: mockContacts[1],
        contacts: mockContacts,
        groups: mockGroups,
      });
    });
  });

  describe('getContactsNew', () => {
    it('新規連絡先のデータを返す', () => {
      const result = getContactsNew();
      expect(result.selectedContact).toEqual({
        id: '',
        name: '',
        phone: '',
        memo: '',
        groupId: null,
      });
    });
  });

  describe('getGroupsList', () => {
    it('グループのリストを返す', () => {
      const mockGroups: Group[] = [{ id: '101', name: 'Friends' }];
      localStorage.setItem('groups', JSON.stringify(mockGroups));
      expect(getGroupsList()).toEqual(mockGroups);
    });
  });

  it('DELETE メソッドでグループを削除する', async () => {
    const group: Group = { id: '1', name: 'Friends' };
    localStorage.setItem('groups', JSON.stringify([group]));
    const params = { id: '1' };
    const request = new Request('http://localhost', { method: 'DELETE' });
    const response = await groupAction({ params, request });
    expect(response.status).toBe(200);
    expect(localStorage.getItem('groups')).not.toContain('Friends');
  });
});

describe('getGroupNew', () => {
  it('新規グループのデータを返す', () => {
    const result = getGroupNew();
    expect(result.group).toEqual({
      id: '',
      name: '',
    });
  });
});
