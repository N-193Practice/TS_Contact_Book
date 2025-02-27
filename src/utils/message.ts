// 表示するメッセージ
export const MESSAGES = {
  CONTACT: {
    CREATE_SUCCESS: '連絡先が作成されました',
    UPDATE_SUCCESS: '連絡先が更新されました',
    DELETE_SUCCESS: '連絡先が削除されました',
    NAME_REQUIRED: '連絡先を入力してください',
  },
  GROUP: {
    CREATE_SUCCESS: 'グループが作成されました',
    UPDATE_SUCCESS: 'グループが更新されました',
    DELETE_SUCCESS: 'グループが削除されました',
    NAME_REQUIRED: 'グループ名を入力してください',
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
  COMMON: {
    NO_DATA: 'データがありません',
    ERROR_CONTENT: '入力内容にエラーがあります',
    ERROR_OCCURRED: 'エラーが発生したため、処理を中断しました',
  },
};
