import { Contact } from '../models/types';
import { Group } from '../models/types';
import { CSVContact } from '../models/types';

/**
 * グループのバリデーションを行う
 * @param {Group} group - バリデーション対象のグループ
 * @param {Group[]} existingGroups - 既存のグループリスト
 * @param {boolean} [isEdit=false] - 編集モードかどうか (新規作成時はfalse)
 * @returns {boolean} バリデーションが成功すれば true、失敗すれば false
 */
export const validateGroup = (
  group: Group,
  existingGroups: Group[],
  isEdit: boolean = false
): boolean => {
  // 空白チェック
  const trimmedName = group.name.trim();
  if (!trimmedName) {
    alert('グループ名は必須です');
    return false;
  }
  // グループの名前の重複チェック
  const isDuplicate = existingGroups.some(
    (g) => g.name === trimmedName && (!isEdit || g.id !== group.id)
  );
  if (isDuplicate) {
    alert('このグループ名はすでに存在します');
    return false;
  }
  return true;
};

/**
 * 連絡先の正当性をチェックする関数。
 * @param {Contact} contact - バリデーション対象の連絡先情報。
 * @param {boolean} [isEdit=false] - 編集モードなのか確認(新規作成時はfalse)。
 * @returns {boolean} バリデーションが成功すれば true、失敗すれば false。
 */
export const validateContact = (
  contact: Contact,
  exisitingContacts: Contact[] = [],
  isEdit: boolean = false
): boolean => {
  // 空白のチェック
  const trimmedName = contact.name.trim();
  const trimmedPhone = contact.phone.trim();
  if (!trimmedName || !trimmedPhone) {
    alert('名前と電話番号は必須です');
    return false;
  }

  //電話番号のチェック(ハイフン除く10-11桁)
  if (!/^[0-9-]+$/.test(trimmedPhone)) {
    alert('電話番号は半角数字のみ入力してください');
    return false;
  }
  //電話番号の先頭には0を含めることができないため、ハイフンを削除してチェックする
  const strippedNumber = trimmedPhone.replace(/-/g, '');
  if (!/^0\d{9,10}$/.test(strippedNumber)) {
    alert(
      '電話番号は半角数字0から始まる10桁以上11桁以内の数字で入力してください'
    );
    return false;
  }

  // 連絡先名前の重複チェック(新規・編集の際)
  const isDuplicate = exisitingContacts.some(
    (c) => c.name === trimmedName && (!isEdit || c.id !== contact.id)
  );
  if (isDuplicate) {
    alert('この名前の連絡先はすでに存在します');
    return false;
  }
  return true;
};

// TODO：CSVのデータのバリデーション
/**
 * CSVの1行分のバリデーションを行う
 * @param {Contact} row - CSVの1行データ
 * @param {Contact[]} existingContacts - 既存の連絡先リスト
 * @param {Group[]} existingGroups - 既存のグループリスト
 * @returns {boolean} バリデーション成功なら true、失敗なら false
 */
export const validateCSVRow = (
  row: CSVContact,
  existingContacts: Contact[]
): boolean => {
  const trimmedName = row.fullName.trim(); // 修正: name → fullName
  const trimmedPhone = row.phone.trim();

  if (!trimmedName || !trimmedPhone) {
    alert(`エラー: 名前または電話番号が空欄です (ID: ${row.contactId})`);
    return false;
  }

  if (!/^[0-9-]+$/.test(trimmedPhone)) {
    alert(`エラー: 電話番号が不正です (ID: ${row.contactId})`);
    return false;
  }

  const strippedNumber = trimmedPhone.replace(/-/g, '');
  if (!/^0\d{9,10}$/.test(strippedNumber)) {
    alert(
      `エラー: 電話番号は0から始まる10桁以上11桁以内の数字で入力してください (ID: ${row.contactId})`
    );
    return false;
  }

  // IDのUUIDフォーマットチェック
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (row.contactId && !uuidRegex.test(row.contactId)) {
    alert(`エラー: IDの形式が正しくありません (ID: ${row.contactId})`);
    return false;
  }

  // 連絡先の重複チェック
  const isDuplicate = existingContacts.some((c) => c.name === trimmedName);
  if (isDuplicate) {
    alert(`エラー: 連絡先の名前が重複しています (${trimmedName})`);
    return false;
  }

  return true;
};

/**
 * CSVのデータ全体をバリデーションする
 * @param {CSVContact[]} csvContacts - CSVのデータリスト
 * @param {Contact[]} existingContacts - 既存の連絡先リスト
 * @returns {boolean} 全データが正しい場合 true、それ以外は false
 */
export const validateContactsFromCSV = (
  csvContacts: CSVContact[],
  existingContacts: Contact[]
): boolean => {
  for (const row of csvContacts) {
    if (!validateCSVRow(row, existingContacts)) {
      return false;
    }
  }
  return true;
};
