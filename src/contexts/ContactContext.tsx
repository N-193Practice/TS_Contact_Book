import React, { createContext, useState, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Contact from '../models/Contact';
import {
  getContacts,
  saveContacts,
  deleteContact,
} from '../utils/localStorage';

type ContactContextType = {
  contacts: Contact[];
  addContact: (name: string, phone: string, memo?: string) => void;
  updateContact: (
    id: string,
    name: string,
    phone: string,
    memo?: string
  ) => void;
  removeContact: (id: string) => void;
};

const ContactContext = createContext<ContactContextType | undefined>(undefined);

function useContactContext(): ContactContextType {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContactContext must be used within a ContactProvider');
  }
  return context;
}

function ContactProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>(getContacts());

  const addContact = (name: string, phone: string, memo?: string) => {
    if (!name || !phone) {
      alert('名前と電話番号は必須です');
      return;
    }
    if (contacts.some((contact) => contact.name === name)) {
      alert('同じ名前の連絡先が既に存在します');
      return;
    }
    const newContact: Contact = { id: uuidv4(), name, phone, memo };
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
  };

  const updateContact = (
    id: string,
    name: string,
    phone: string,
    memo?: string
  ) => {
    const updatedContacts = contacts.map((contact) =>
      contact.id === id ? { ...contact, name, phone, memo } : contact
    );
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
  };

  const removeContact = (id: string) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
    deleteContact(id);
  };

  return (
    <ContactContext.Provider
      value={{ contacts, addContact, updateContact, removeContact }}
    >
      {children}
    </ContactContext.Provider>
  );
}

export { useContactContext, ContactProvider };
