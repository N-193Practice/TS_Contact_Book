/**
 * 連絡先モデル。オプションのメモ付きの個別の連絡先エントリを表す。
 * @property {string} id - 連絡先の一意の識別子。
 * @property {string} name - 連絡先の名前。
 * @property {string} phone - 連絡先の電話番号。
 * @property {string} [memo] - 追加の詳細のためのオプションのメモフィールド。
 * @property {string} [groupId] - グループの一意の識別子。未分類ならnull。
 */
export type Contact = {
  id: string;
  name: string;
  phone: string;
  memo?: string;
  groupId?: string | null;
};
