import { Contact } from '../models/types';
import { Group } from '../models/types';

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

  // 名前の重複チェック
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
 * 連絡先のバリデーションを行う
 * @param {Contact} contact - バリデーション対象の連絡先
 * @param {Contact[]} existingContacts - 既存の連絡先リスト
 * @param {boolean} [isEdit=false] - 編集モードかどうか (新規作成時はfalse)
 * @returns {boolean} バリデーションが成功すれば true、失敗すれば false
 */
export const validateContact = (
  contact: Contact,
  existingContacts: Contact[],
  isEdit: boolean = false
): boolean => {
  // 空白チェック
  const trimmedName = contact.name.trim();
  const trimmedPhone = contact.phone.trim();
  if (!trimmedName || !trimmedPhone) {
    alert('名前と電話番号は必須です');
    return false;
  }

  // 電話番号のチェック (半角数字とハイフンのみ)
  if (!/^[0-9-]+$/.test(trimmedPhone)) {
    alert('電話番号は半角数字のみ入力してください');
    return false;
  }

  // 電話番号のフォーマット (0から始まり10~11桁)
  const strippedNumber = trimmedPhone.replace(/-/g, '');
  if (!/^0\d{9,10}$/.test(strippedNumber)) {
    alert(
      '電話番号は半角数字0から始まる10桁以上11桁以内の数字で入力してください'
    );
    return false;
  }

  // 名前の重複チェック
  const isDuplicate = existingContacts.some(
    (c) => c.name === trimmedName && (!isEdit || c.id !== contact.id)
  );
  if (isDuplicate) {
    alert('この名前の連絡先はすでに存在します');
    return false;
  }

  return true;
};
