import { Contact, Group, CSVContact } from '../models/types';

// TODO:CSVContact → Contact (インポート時)
export const csvToContact = (
  csvData: CSVContact,
  groups: Group[],
  addGroup: (newGroup: Group) => void
): Contact => {
  let group = groups.find((g) => g.name === csvData.groupName);
  if (!group && csvData.groupName) {
    // グループが存在しない場合、新規作成
    group = { id: crypto.randomUUID(), name: csvData.groupName };
    addGroup(group); // グループリストに追加
  }
  return {
    id: csvData.contactId,
    name: csvData.fullName,
    phone: csvData.phone,
    memo: csvData.memo || '',
    groupId: group ? group.id : null, // 既存 or 新規作成したグループのID
  };
};

// TODO:Contact → CSVContact (エクスポート時)
export const contactToCSV = (contact: Contact, groups: Group[]): CSVContact => {
  const group = groups.find((g) => g.id === contact.groupId);
  return {
    contactId: contact.id,
    groupName: group?.name || '',
    fullName: contact.name,
    phone: contact.phone,
    memo: contact.memo || '',
  };
};
