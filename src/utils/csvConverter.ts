import { Contact, Group, CSVContact } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * `CSVContact` を `Contact` に変換する (インポート時)
 * @param {CSVContact} csvData - CSVファイルのデータ。
 * @param {Contact[]} contacts - 既存の連絡先リスト。
 * @param {Group[]} groups - 既存のグループリスト。
 * @param {(newGroup: Group) => void} addGroup - グループの追加を行う関数。
 * @returns {Contact} CSVファイルのデータを表す連絡先。
 */
export const csvToContact = (
  csvData: CSVContact,
  contacts: Contact[],
  groups: Group[],
  addGroup: (newGroup: Group) => void
): Contact => {
  console.log('🔄 CSV から Contact へ変換開始:', csvData);

  // 既存の連絡先を検索 (IDが一致する場合は既存データ)
  const existingContact = contacts.find((c) => c.id === csvData.contactId);

  // **グループの処理**
  let group = groups.find((g) => g.name === csvData.groupName);
  if (!group && csvData.groupName && csvData.groupName.trim() !== '') {
    // グループが存在しない場合、新規作成して登録
    group = { id: uuidv4(), name: csvData.groupName };
    addGroup(group);
  }

  // **新しい Contact オブジェクトの作成**
  const contact: Contact = {
    id: existingContact ? existingContact.id : csvData.contactId || uuidv4(),
    name: csvData.fullName, // fullNameをnameに変換
    phone: csvData.phone,
    memo: csvData.memo || existingContact?.memo || '',
    groupId: group ? group.id : null, // **グループがある場合はIDをセット**
  };

  console.log('✅ Contact へ変換完了:', contact);
  return contact;
};

/**
 * `Contact` を `CSVContact` に変換する (エクスポート時)
 * @param {Contact} contact - エクスポートする連絡先。
 * @param {Group[]} groups - グループのリスト。
 * @returns {CSVContact} 変換後の `CSVContact` データ。
 */
export const contactToCSV = (contact: Contact, groups: Group[]): CSVContact => {
  console.log('📤 Contact から CSVContact へ変換開始:', contact);

  const group = groups.find((g) => g.id === contact.groupId);
  const csvContact: CSVContact = {
    contactId: contact.id,
    fullName: contact.name, // nameをfullNameに変換
    phone: contact.phone,
    memo: contact.memo || '',
    groupName: group?.name || '',
  };

  console.log('✅ CSVContact へ変換完了:', csvContact);
  return csvContact;
};
