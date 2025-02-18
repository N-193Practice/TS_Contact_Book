import { Contact, Group, CSVContact } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

// TODO:連絡先のId作成によるユニークなIDの生成(既存の場合は上書き,ない場合は新規作成)
// TODO:グループの存在チェック(もし同一のグループ名がある場合は上書き、ない場合は新規作成)
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
  // 既存の連絡先を検索(IDが一致すれば更新)
  const exisitingContact = contacts.find((c) => c.id === csvData.contactId);
  // 既存の連絡先がない場合は新規作成
  const contactId: string = exisitingContact ? exisitingContact.id : uuidv4();

  // グループ名の検索
  let group = Array.isArray(groups)
    ? groups.find((g) => g.name === csvData.groupName)
    : null;
  if (!group && csvData.groupName) {
    // グループ名がある場合はグループを新規作成
    group = { id: uuidv4(), name: csvData.groupName };
    addGroup(group); // グループリストに追加
  }
  return {
    id: contactId,
    name: csvData.fullName,
    phone: csvData.phone,
    memo: csvData.memo || '',
    groupId: group ? group.id : null, // 既存 or 新規作成したグループのID
  };
};

//Contact → CSVContact (エクスポート時)
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
