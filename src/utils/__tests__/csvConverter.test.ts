import { describe, it, expect } from 'vitest';
import { csvToContact, contactToCSV } from '../csvConverter';
import { Contact, Group, CSVContact } from '../../models/types';

describe('CSV コンバータ関数', () => {
  describe('csvToContact', () => {
    it('CSVContact を Contact に変換する', () => {
      const csvContact: CSVContact = {
        contactId: '1',
        fullName: 'John Doe',
        phone: '099-9999-9999',
        memo: 'Test memo',
        groupName: 'Friends',
      };
      const expectedContact: Contact = {
        id: '1',
        name: 'John Doe',
        phone: '099-9999-9999',
        memo: 'Test memo',
        groupId: '1',
      };
      const contacts: Contact[] = [expectedContact];
      const groups: Group[] = [{ id: '1', name: 'Friends' }];
      const addGroup = (groupName: string) => ({ id: '2', name: groupName });

      const contact = csvToContact(csvContact, contacts, groups, addGroup);
      expect(contact).toEqual(expectedContact);
    });

    it('存在しない場合は新しいグループを作成する', () => {
      const csvContact: CSVContact = {
        contactId: '1',
        fullName: 'John Doe',
        phone: '099-9999-9999',
        memo: 'Test memo',
        groupName: 'Family',
      };
      const expectedContact: Contact = {
        id: '1',
        name: 'John Doe',
        phone: '099-9999-9999',
        memo: 'Test memo',
        groupId: '2',
      };
      const contacts: Contact[] = [expectedContact];
      const groups: Group[] = [{ id: '1', name: 'Friends' }];
      const addGroup = (groupName: string) => ({ id: '2', name: groupName });

      const contact = csvToContact(csvContact, contacts, groups, addGroup);
      expect(contact).toEqual(expectedContact);
    });
  });

  describe('contactToCSV', () => {
    it('Contact を CSVContact に変換する', () => {
      const contact: Contact = {
        id: '1',
        name: 'John Doe',
        phone: '099-9999-9999',
        memo: 'Test memo',
        groupId: '1',
      };
      const groups: Group[] = [{ id: '1', name: 'Friends' }];

      const csvContact = contactToCSV(contact, groups);
      expect(csvContact).toEqual({
        contactId: '1',
        fullName: 'John Doe',
        phone: '099-9999-9999',
        memo: 'Test memo',
        groupName: 'Friends',
      });
    });

    it('グループが存在しない場合は groupName を空文字列に設定する', () => {
      const contact: Contact = {
        id: '1',
        name: 'John Doe',
        phone: '099-9999-9999',
        memo: 'Test memo',
        groupId: '2',
      };
      const groups: Group[] = [{ id: '1', name: 'Friends' }];

      const csvContact = contactToCSV(contact, groups);
      expect(csvContact).toEqual({
        contactId: '1',
        fullName: 'John Doe',
        phone: '099-9999-9999',
        memo: 'Test memo',
        groupName: '',
      });
    });
  });
});
