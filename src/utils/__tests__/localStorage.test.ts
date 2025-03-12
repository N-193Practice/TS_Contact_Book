import { describe, it, expect, beforeEach } from 'vitest';
import {
  getContacts,
  saveContacts,
  createContact,
  updateContact,
  deleteContact,
  getGroups,
  saveGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from '../localStorage';
import { Contact, Group } from '../../models/types';

describe('ローカルストレージ関数', () => {
  describe('localStorage 関数', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    describe('連絡先', () => {
      it('連絡先を保存して取得する', () => {
        const contacts: Contact[] = [
          { id: '1', name: 'John Doe', phone: '123-456', groupId: null },
        ];
        saveContacts(contacts);
        expect(getContacts()).toEqual(contacts);
      });

      it('新しい連絡先を作成する', () => {
        const contact: Contact = {
          id: '',
          name: 'John Doe',
          phone: '123-456',
          groupId: null,
        };
        const newContact = createContact(contact);
        expect(newContact.id).toBeTruthy();
        expect(getContacts()).toContainEqual(newContact);
      });

      it('既存の連絡先を更新する', () => {
        const contact: Contact = {
          id: '1',
          name: 'John Doe',
          phone: '123-456',
          groupId: null,
        };
        saveContacts([contact]);
        const updatedContact = { ...contact, name: 'Jane Doe' };
        updateContact(updatedContact);
        expect(getContacts()).toContainEqual(updatedContact);
      });

      it('連絡先を削除する', () => {
        const contact: Contact = {
          id: '1',
          name: 'John Doe',
          phone: '123-456',
          groupId: null,
        };
        saveContacts([contact]);
        deleteContact(contact.id);
        expect(getContacts()).not.toContainEqual(contact);
      });
    });

    describe('グループ', () => {
      it('グループを保存して取得する', () => {
        const groups: Group[] = [{ id: '1', name: 'Friends' }];
        saveGroups(groups);
        expect(getGroups()).toEqual(groups);
      });

      it('新しいグループを作成する', () => {
        const groupName = 'Friends';
        const newGroup = createGroup(groupName);
        expect(newGroup.id).toBeTruthy();
        expect(getGroups()).toContainEqual(newGroup);
      });

      it('既存のグループを更新する', () => {
        const group: Group = { id: '1', name: 'Friends' };
        saveGroups([group]);
        const updatedGroup = { ...group, name: 'Family' };
        updateGroup(updatedGroup);
        expect(getGroups()).toContainEqual(updatedGroup);
      });

      it('グループを削除する', () => {
        const group: Group = { id: '1', name: 'Friends' };
        saveGroups([group]);
        deleteGroup(group.id);
        expect(getGroups()).not.toContainEqual(group);
      });

      it('グループが削除されたときに連絡先の groupId をリセットする', () => {
        const group: Group = { id: '1', name: 'Friends' };
        const contact: Contact = {
          id: '1',
          name: 'John Doe',
          phone: '123-456',
          groupId: group.id,
        };
        saveGroups([group]);
        saveContacts([contact]);
        deleteGroup(group.id);
        expect(getContacts()[0].groupId).toBeNull();
      });
    });
  });
});
