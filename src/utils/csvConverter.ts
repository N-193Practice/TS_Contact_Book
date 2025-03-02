import { Contact, Group, CSVContact } from '../models/types';

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
  addGroup: (groupName: string) => Group
): Contact => {
  // 既存の連絡先を検索 (IDが一致する場合は既存データ)
  const existingContact = contacts.find((c) => c.id === csvData.contactId);

  // **グループの処理**
  let group = groups.find((g) => g.name === csvData.groupName);
  if (!group && csvData.groupName && csvData.groupName.trim() !== '') {
    // グループが存在しない場合、新規作成して登録
    group = addGroup(csvData.groupName);
  }

  // **新しい Contact オブジェクトの作成**
  const contact: Contact = {
    id: existingContact?.id || '', //既存のIDがある場合はそのまま使う、なければ作成
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
export const contactToCSV = (contact: Contact, groups: Group[]): CSVContact => {
  // グループのテーブルからグループを検索
  const group = groups.find((g) => g.id === contact.groupId);
  console.log('Contact から CSVContact へ変換開始後:', group);
  const csvContact: CSVContact = {
    contactId: contact.id,
    fullName: contact.name, // nameをfullNameに変換
    phone: contact.phone,
    memo: contact.memo || '',
    groupName: group ? group.name : '',
  };

  return csvContact;
};
