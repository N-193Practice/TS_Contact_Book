import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  JSX,
  useCallback,
} from 'react';
import { Group } from '../models/types';
import { getGroups, saveGroups } from '../utils/localStorage';
import { validateGroup } from '../utils/validation';

/**
 * グループのコンテキスト。
 * @property {Group[]} groups - グループの配列。
 * @property {(groups: Group[]) => void} setGroups - グループの配列を更新する関数。
 * @property {(group: Group) => boolean} addGroup - グループの追加を行う関数。
 * @property {(group: Group) => boolean} updateGroup - グループの更新を行う関数。
 * @property {() => void} reloadGroups - グループのリストを再読み込みする関数。
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
  addGroup: (group: Group) => boolean;
  updateGroup: (group: Group) => boolean;
  reloadGroups: () => void;
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

  // GroupのCRUD処理(初回時ロード)
  useEffect(() => {
    setGroups(getGroups());
  }, []);

  // グループのリロード(無限ループ防ぐため)
  const reloadGroups = useCallback(() => {
    setGroups([...getGroups()]); // **新しい配列を作成**
  }, []);

  /**
   * グループを追加する関数。
   * @param {Group} group - 追加するグループオブジェクト。
   * @returns {boolean} 登録に成功すれば true、失敗すれば false。
   */
  const addGroup = (group: Group): boolean => {
    if (!validateGroup(group, groups)) return false;

    setGroups((prevGroups) => {
      const updatedGroups = [...prevGroups, group];
      saveGroups(updatedGroups);
      return updatedGroups;
    });

    setTimeout(() => {
      setGroups(getGroups()); // 確実にデータを取得
    }, 500);
    setRecentlyCreatedGroupId(group.id);
    return true;
  };

  /**
   * グループを更新する関数。
   * @param {Group} group - 更新するグループオブジェクト。
   * @returns {boolean} 更新に成功すれば true、失敗すれば false。
   */
  const updateGroup = (group: Group): boolean => {
    const groups = getGroups();
    if (!validateGroup(group, groups, true)) return false;
    const updatedGroups = groups.map((g) =>
      g.id === group.id ? { ...g, name: group.name } : g
    );
    saveGroups(updatedGroups);
    return true;
  };

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
        addGroup,
        updateGroup,
        reloadGroups,
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
