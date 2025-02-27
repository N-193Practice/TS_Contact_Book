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
  return contact;
};

/**
 * `Contact` を `CSVContact` に変換する (エクスポート時)
 * @param {Contact} contact - エクスポートする連絡先。
 * @param {Group[]} groups - グループのリスト。
 * @returns {CSVContact} 変換後の `CSVContact` データ。
 */
export const contactToCSV = (contact: Contact): CSVContact => {
  // **Contact の情報のみ取得**
  const csvContact: CSVContact = {
    contactId: contact.id,
    fullName: contact.name,
    phone: contact.phone,
    memo: contact.memo || '',
    groupName: '', // Contact の出力時はグループ名を空にする
  };

  return csvContact;
};

export const groupToCSV = (group: Group): CSVContact => {
  // **Group の情報のみ取得**
  const csvGroup: CSVContact = {
    contactId: '', // Group の場合は contactId は不要
    fullName: '',
    phone: '',
    memo: '',
    groupName: group.name, // Group の情報は groupName のみ
  };

  return csvGroup;
};

export const exportCSV = (contacts: Contact[], groups: Group[]) => {
  // **Contact のデータを CSV フォーマットへ変換**
  const csvContacts: CSVContact[] = contacts.map(contactToCSV);

  // **Group のデータを CSV フォーマットへ変換**
  const csvGroups: CSVContact[] = groups.map(groupToCSV);

  // **全データを統合してCSVへ出力**
  const csvData = [...csvContacts, ...csvGroups];

  return csvData;
};
