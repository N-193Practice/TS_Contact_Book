/**
 * アプリケーションのエラークラス。
 * @property {string} message - エラーメッセージ。
 * @property {number} statusCode - HTTPステータスコード。
 * @property {string} name - エラー名。
 */
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}
