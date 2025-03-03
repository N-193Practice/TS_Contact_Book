// 表示するメッセージ
export const MESSAGES = {
  CONTACT: {
    CREATE_SUCCESS: '連絡先が作成されました',
    UPDATE_SUCCESS: '連絡先が更新されました',
    DELETE_SUCCESS: '連絡先が削除されました',
    NAME_REQUIRED: '連絡先を入力してください',
    NAME_ALREADY_EXISTS: '既に存在する連絡先です',
  },
  GROUP: {
    CREATE_SUCCESS: 'グループが作成されました',
    UPDATE_SUCCESS: 'グループが更新されました',
    DELETE_SUCCESS: 'グループが削除されました',
    DELETE_FAIL: 'グループの削除に失敗しました',
    NAME_REQUIRED: 'グループ名は必須です',
    NAME_ALREADY_EXISTS: '既に存在するグループ名です',
    NO_SELECTED_GROUP: 'グループを選択してください',
    CREATE_ERROR: 'グループの作成に失敗しました',
    UPDATE_ERROR: 'グループの更新に失敗しました',
  },
  CSV: {
    EXPORT_SUCCESS: 'データを出力しました',
    EXPORT_ERROR: 'データの出力に失敗しました',
    IMPORT_SUCCESS: 'データをインポートしました',
    IMPORT_ERROR: 'データのインポートに失敗しました',
    NO_SELECTED_FILE: 'インポートするファイルを選択してください',
    NO_DATA_IN_FILE: 'CSVファイルにデータがありません',
    VALIDATION_ERROR: '内容に不備があるため処理中断しました',
  },
  VALIDATION: {
    NAME_REQUIRED: '名前は必須です',
    NAME_ALREADY_EXISTS: '既に存在する名前です',
    PHONE_REQUIRED: '電話番号は必須です',
    PHONE_INVALID: '電話番号は半角数字のみ入力してください',
    PHONE_INVALID_LENGTH:
      '電話番号は半角数字0から始まる10桁以上11桁以内の数字で入力してください',
  },
  COMMON: {
    NO_DATA: 'データがありません',
    ERROR_CONTENT: '入力内容にエラーがあります',
    ERROR_OCCURRED: 'エラーが発生したため、処理を中断しました',
    SAVE_ERROR: 'データの保存に失敗しました',
    CONFIRM_DELETE: '本当にこのデータを削除しますか？',
    CONFIRM_CANCEL: 'この操作をキャンセルしますか？',
  },
};
