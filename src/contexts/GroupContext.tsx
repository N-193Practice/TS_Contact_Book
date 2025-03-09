import { createContext, useState, ReactNode, JSX } from 'react';
import { Group } from '../models/types';

/**
 * グループのコンテキスト。
 * @property {Group[]} groups - グループの配列。
 * @property {(groups: Group[]) => void} setGroups - グループの配列を更新する関数。
 * @property {(group: Group) => boolean} updateGroup - グループの更新を行う関数。
 * @property {(string | null)} errorMessage - エラーメッセージ。
 * @property {(message: string | null) => void} setErrorMessage -エラーメッセージを設定する関数。
 * @property {(string | null)} successMessage - 成功メッセージ。
 * @property {(message: string | null) => void} setSuccessMessage - 成功メッセージを設定する関数。
 * @property {boolean} confirmOpen - 削除確認ダイアログの状態。
 * @property {(open: boolean) => void} setConfirmOpen - 削除確認ダイアログの状態を設定する関数。
 * @property {string | null} deleteTargetId - 削除対象のグループID。
 * @property {(id: string | null) => void} setDeleteTargetId - 削除対象のグループIDを設定する関数。
 * @property {string | null} message - 通知メッセージ。
 * @property {(message: string | null) => void} setMessage - 通知メッセージを設定する関数。
 * @property {'success' | 'error' | 'info'} messageSeverity - 通知メッセージのセマンティクス。
 * @property {(severity: 'success' | 'error' | 'info') => void} setMessageSeverity - 通知メッセージのセマンティクスを設定する関数。
 * @property {string | null} recentlyCreatedGroupId - 最近作成したグループのID。
 * @property {() => void} clearRecentlyCreatedGroupId - 最近作成したグループのIDをクリアする関数。
 */
export type GroupContextType = {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
  successMessage: string | null;
  setSuccessMessage: (message: string | null) => void;
  confirmOpen: boolean;
  setConfirmOpen: (open: boolean) => void;
  deleteTargetId: string | null;
  setDeleteTargetId: (id: string | null) => void;
  message: string | null;
  setMessage: (message: string | null) => void;
  messageSeverity: 'success' | 'error' | 'info';
  setMessageSeverity: (severity: 'success' | 'error' | 'info') => void;
  recentlyCreatedGroupId: string | null;
  clearRecentlyCreatedGroupId: () => void;
};

// Context の作成
const GroupContext = createContext<GroupContextType | undefined>(undefined);

/**
 * プロバイダーの props 型定義
 * @property {ReactNode} children - プロバイダーによってラップされる子コンポーネント。
 */
type GroupProviderProps = {
  children: ReactNode;
};

/**
 * ContactProvider - 連絡先の状態管理を提供するプロバイダー。
 * @param {GroupProviderrProps} props - `children` を受け取る。
 * @returns {JSX.Element} プロバイダー コンポーネント。
 */
function GroupProvider({ children }: GroupProviderProps): JSX.Element {
  const [groups, setGroups] = useState<Group[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [recentlyCreatedGroupId, setRecentlyCreatedGroupId] = useState<
    string | null
  >(null);

  // 削除確認ダイアログの状態
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 通知メッセージの状態
  const [message, setMessage] = useState<string | null>(null);
  const [messageSeverity, setMessageSeverity] = useState<
    'success' | 'error' | 'info'
  >('info');

  /**
   * グループの編集を開始する関数。
   * @returns {void} この関数は値を返さず、グループの編集を開始し、リストを更新する。
   */
  const clearRecentlyCreatedGroupId = (): void => {
    setRecentlyCreatedGroupId(null);
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        setGroups,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
        confirmOpen,
        setConfirmOpen,
        deleteTargetId,
        setDeleteTargetId,
        message,
        setMessage,
        messageSeverity,
        setMessageSeverity,
        recentlyCreatedGroupId,
        clearRecentlyCreatedGroupId,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}
export { GroupProvider, GroupContext };
