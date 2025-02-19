import { Contact, Group, CSVContact } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * `CSVContact` を `Contact` に変換する(インポート時)。
 * @param {CSVContact} csvData - CSVファイルのデータ。
 * @param {Group[]} groups - グループのリスト。
 * @param {(newGroup: Group) => void} addGroup - グループの追加を行う関数。
 * @returns {Contact} CSVファイルのデータを表す連絡先。
 */
export const csvToContact = (
  csvData: CSVContact,
  contacts: Contact[],
  groups: Group[],
  addGroup: (newGroup: Group) => void
): Contact => {
  // 既存の連絡先を検索
  const existingContact = contacts.find((c) => c.id === csvData.contactId);
  // 既存の連絡先がない場合は新規作成
  let contactId: string;
  if (existingContact) {
    // 既存の連絡先がある場合 → 更新
    contactId = existingContact.id;
  } else if (csvData.contactId) {
    // 既存データがなく、CSV に contactId がある場合 → CSV の ID を使用
    contactId = csvData.contactId;
  } else {
    // 既存データがなく、CSV に contactId がない場合 → 新しい UUID を生成
    contactId = uuidv4();
  }

  // 既存のグループ名を検索
  let group = groups.find((g) => g.name === csvData.groupName);
  if (!group && csvData.groupName && csvData.groupName.trim() !== '') {
    group = { id: uuidv4(), name: csvData.groupName };
    addGroup(group);
  }

  // `Contact` `groupId` の値を `null` に変換する
  return {
    id: contactId,
    name: csvData.fullName,
    phone: csvData.phone,
    memo: csvData.memo || '',
    groupId: group ? group.id : null,
  };
};

//Contact → CSVContact (エクスポート時)
export const contactToCSV = (contact: Contact, groups: Group[]): CSVContact => {
  const group = groups.find((g) => g.id === contact.groupId);
  return {
    contactId: contact.id,
    fullName: contact.name,
    phone: contact.phone,
    memo: contact.memo || '',
    groupName: group?.name || '',
  };
};
