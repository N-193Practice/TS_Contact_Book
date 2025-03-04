import { describe, it, expect, beforeEach } from 'vitest';
import { getContactsList } from '../contactServices';
import { Contact, Group } from '../../models/types';

describe('getContactsList', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return empty contacts and groups when no data exists', () => {
    expect(getContactsList()).toEqual({
      selectedContact: null,
      contacts: [],
      groups: [],
    });
  });

  it('should return contacts from localStorage', () => {
    const mockContacts: Contact[] = [
      { id: '1', name: 'John Doe', phone: '123-456', memo: '', groupId: null },
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
});
