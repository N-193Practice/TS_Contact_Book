import { Contact, Group, CSVContact } from '../models/types';

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

/**
 * Contact または CSVContact に対応する型
 */
export type ValidatableContact = Pick<Contact, 'name' | 'phone'> &
  Partial<Contact>;

/**
 * 連絡先のバリデーションを行う関数
 * @param {T} contact - Contact または CSVContact
 * @param {T[]} existingContacts - 既存の連絡先リスト
 * @param {boolean} [isEdit=false] - 編集モードの場合 true
 * @returns {boolean} バリデーション成功なら true、失敗なら false
 */
export const validateContactData = <T extends ValidatableContact>(
  contact: T,
  existingContacts: T[],
  isEdit: boolean = false
): boolean => {
  console.log('🔍 バリデーション開始:', contact);

  const trimmedName = contact.name.trim();
  const trimmedPhone = contact.phone.trim();

  if (!trimmedName || !trimmedPhone) {
    alert('名前と電話番号は必須です');
    console.log('❌ 名前または電話番号が空です:', contact);
    return false;
  }

  if (!/^[0-9-]+$/.test(trimmedPhone)) {
    alert('エラー: 電話番号が不正です');
    console.log('❌ 電話番号の形式が不正:', contact);
    return false;
  }

  const strippedNumber = trimmedPhone.replace(/-/g, '');
  if (!/^0\d{9,10}$/.test(strippedNumber)) {
    alert(
      'エラー: 電話番号は0から始まる10桁以上11桁以内の数字で入力してください'
    );
    console.log(
      '❌ 電話番号が 0 から始まる 10 桁以上 11 桁以内でない:',
      contact
    );
    return false;
  }

  // 連絡先の重複チェック
  const isDuplicate = existingContacts.some(
    (c) => c.name === trimmedName && (!isEdit || c.id !== contact.id)
  );
  if (isDuplicate) {
    alert(`エラー: 連絡先の名前が重複しています (${trimmedName})`);
    console.log('❌ 名前が重複:', contact);
    return false;
  }

  return true;
};

/**
 * CSVの1行分のバリデーションを行う
 * @param {CSVContact} row - CSVの1行データ
 * @param {Contact[]} existingContacts - 既存の連絡先リスト
 * @param {Group[]} existingGroups - 既存のグループリスト
 * @param {CSVContact[]} csvContacts - CSVの全データリスト（グループ重複チェック用）
 * @returns {boolean} バリデーション成功なら true、失敗なら false
 */
export const validateCSVRow = (
  row: CSVContact,
  existingContacts: Contact[],
  existingGroups: Group[],
  csvContacts: CSVContact[]
): boolean => {
  console.log('🔍 バリデーション開始:', row);
  const trimmedName = row.fullName.trim(); // fullNameをnameに変換
  const trimmedPhone = row.phone.trim();
  const trimmedGroupName = row.groupName?.trim();

  // 名前・電話番号の必須チェック
  if (!trimmedName || !trimmedPhone) {
    alert(`エラー: 名前または電話番号が空欄です (ID: ${row.contactId})`);
    console.log('❌ 名前または電話番号が空です:', row);
    return false;
  }

  // 電話番号のフォーマットチェック
  if (!/^[0-9-]+$/.test(trimmedPhone)) {
    alert(`エラー: 電話番号が不正です (ID: ${row.contactId})`);
    console.log('❌ 電話番号の形式が不正:', row);
    return false;
  }

  // 電話番号の長さチェック (ハイフン除く10-11桁)
  const strippedNumber = trimmedPhone.replace(/-/g, '');
  if (!/^0\d{9,10}$/.test(strippedNumber)) {
    alert(
      `エラー: 電話番号は0から始まる10桁以上11桁以内の数字で入力してください (ID: ${row.contactId})`
    );
    console.log('❌ 電話番号の桁数が不正:', row);
    return false;
  }

  // UUID のフォーマットチェック (任意)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (row.contactId && !uuidRegex.test(row.contactId)) {
    alert(`エラー: IDの形式が正しくありません (ID: ${row.contactId})`);
    console.log('❌ UUID のフォーマットが不正:', row);
    return false;
  }

  // 連絡先の重複チェック
  const isDuplicateContact = existingContacts.some(
    (c) => c.name === trimmedName
  );
  if (isDuplicateContact) {
    alert(`エラー: 連絡先の名前が重複しています (${trimmedName})`);
    console.log('❌ 名前が重複:', row);
    return false;
  }

  // グループ名の重複チェック (グループ名がある場合のみ)
  if (trimmedGroupName) {
    const isDuplicateGroup =
      existingGroups.some((g) => g.name === trimmedGroupName) ||
      csvContacts.filter((c) => c.groupName?.trim() === trimmedGroupName)
        .length > 1;

    if (isDuplicateGroup) {
      alert(`エラー: グループ名が重複しています (${trimmedGroupName})`);
      console.log('❌ グループ名が重複:', row);
      return false;
    }
  }

  return true;
};

/**
 * CSVのデータ全体をバリデーションする
 * @param {CSVContact[]} csvContacts - CSVのデータリスト
 * @param {Contact[]} existingContacts - 既存の連絡先リスト
 * @param {Group[]} existingGroups - 既存のグループリスト
 * @returns {boolean} 全データが正しい場合 true、それ以外は false
 */
export const validateContactsFromCSV = (
  csvContacts: CSVContact[],
  existingContacts: Contact[],
  existingGroups: Group[]
): boolean => {
  for (const row of csvContacts) {
    if (!validateCSVRow(row, existingContacts, existingGroups, csvContacts)) {
      return false;
    }
  }
  return true;
};
