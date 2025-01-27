import Contact from '../models/Contact.ts';

const STORAGE_KEY = 'contacts';
function getContacts(): Contact[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveContacts(contacts: Contact[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

function deleteContact(id: string): void {
  const contacts = getContacts();
  const updatedContacts = contacts.filter((contact) => contact.id !== id);
  saveContacts(updatedContacts);
}

export { getContacts, saveContacts, deleteContact };
