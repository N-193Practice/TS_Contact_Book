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
        recentlyCreatedGroupId,
        clearRecentlyCreatedGroupId,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}
export { GroupProvider, GroupContext };
