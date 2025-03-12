import { describe, it, expect } from 'vitest';
import {
  validateGroup,
  validateContact,
  validatePhone,
  validateName,
} from '../validation';
import { MESSAGES } from '../message';
import { Contact, Group } from '../../models/types';

describe('バリデーション関数', () => {
  describe('validateGroup', () => {
    it('グループ名が空の場合は false を返す', () => {
      const group: Group = { id: '1', name: '' };
      const existingGroups: Group[] = [];
      const setErrorMessage = (message: string) => {
        expect(message).toBe(MESSAGES.GROUP.NAME_REQUIRED);
      };
      expect(validateGroup(group, existingGroups, false, setErrorMessage)).toBe(
        false
      );
    });

    it('グループ名が既に存在する場合は false を返す', () => {
      const group: Group = { id: '1', name: 'Friends' };
      const existingGroups: Group[] = [{ id: '2', name: 'Friends' }];
      const setErrorMessage = (message: string) => {
        expect(message).toBe(MESSAGES.GROUP.NAME_ALREADY_EXISTS);
      };
      expect(validateGroup(group, existingGroups, false, setErrorMessage)).toBe(
        false
      );
    });

    it('グループ名が有効で一意である場合は true を返す', () => {
      const group: Group = { id: '1', name: 'Family' };
      const existingGroups: Group[] = [{ id: '2', name: 'Friends' }];
      const setErrorMessage = (message: string) => {
        expect(message).toBe('');
      };
      expect(validateGroup(group, existingGroups, false, setErrorMessage)).toBe(
        true
      );
    });
  });

  describe('validateContact', () => {
    it('連絡先名が空の場合は false を返す', () => {
      const contact: Contact = {
        id: '1',
        name: '',
        phone: '123-456',
        groupId: null,
      };
      const existingContacts: Contact[] = [];
      const setErrorName = (message: string) => {
        expect(message).toBe(MESSAGES.VALIDATION.NAME_REQUIRED);
      };
      const setErrorPhone = (message: string) => {
        expect(message).toBe(MESSAGES.VALIDATION.PHONE_INVALID_LENGTH);
      };
      expect(
        validateContact(
          contact,
          existingContacts,
          false,
          setErrorName,
          setErrorPhone
        )
      ).toBe(false);
    });

    it('連絡先の電話番号が無効な場合は false を返す', () => {
      const contact: Contact = {
        id: '1',
        name: 'John Doe',
        phone: 'abc',
        groupId: null,
      };
      const existingContacts: Contact[] = [];
      const setErrorName = (message: string) => {
        expect(message).toBe('');
      };
      const setErrorPhone = (message: string) => {
        expect(message).toBe(MESSAGES.VALIDATION.PHONE_INVALID);
      };
      expect(
        validateContact(
          contact,
          existingContacts,
          false,
          setErrorName,
          setErrorPhone
        )
      ).toBe(false);
    });

    it('連絡先名と電話番号が有効な場合は true を返す', () => {
      const contact: Contact = {
        id: '1',
        name: 'John Doe',
        phone: '099-9999-9999',
        groupId: null,
      };
      const existingContacts: Contact[] = [];
      const setErrorName = (message: string) => {
        expect(message).toBe('');
      };
      const setErrorPhone = (message: string) => {
        expect(message).toBe('');
      };
      expect(
        validateContact(
          contact,
          existingContacts,
          false,
          setErrorName,
          setErrorPhone
        )
      ).toBe(true);
    });
  });

  describe('validatePhone', () => {
    it('電話番号が空の場合は false を返す', () => {
      const setErrorMessage = (message: string) => {
        expect(message).toBe(MESSAGES.VALIDATION.PHONE_REQUIRED);
      };
      expect(validatePhone('', setErrorMessage)).toBe(false);
    });

    it('電話番号に無効な文字が含まれている場合は false を返す', () => {
      const setErrorMessage = (message: string) => {
        expect(message).toBe(MESSAGES.VALIDATION.PHONE_INVALID);
      };
      expect(validatePhone('123-abc', setErrorMessage)).toBe(false);
    });

    it('電話番号が有効な場合は true を返す', () => {
      const setErrorMessage = (message: string) => {
        expect(message).toBe('');
      };
      expect(validatePhone('099-8888-8888', setErrorMessage)).toBe(true);
    });
  });

  describe('validateName', () => {
    it('名前が空の場合は false を返す', () => {
      const setErrorMessage = (message: string) => {
        expect(message).toBe(MESSAGES.VALIDATION.NAME_REQUIRED);
      };
      expect(validateName('', setErrorMessage)).toBe(false);
    });

    it('名前が有効な場合は true を返す', () => {
      const setErrorMessage = (message: string) => {
        expect(message).toBe('');
      };
      expect(validateName('John Doe', setErrorMessage)).toBe(true);
    });
  });
});
