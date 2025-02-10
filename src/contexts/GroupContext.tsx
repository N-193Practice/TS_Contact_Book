import { createContext, useState, useEffect, ReactNode, JSX } from 'react';
import { Group } from '../models/Group';
import { getGroups, saveGroups, deleteGroup } from '../utils/localStorage';

// TODO:グループ機能の実装
export type GroupContextType = {
  groups: Group[];
  addGroup: (group: Group) => boolean;
  updateGroup: (group: Group) => boolean;
  handleDeleteGroup: (id: string) => void;
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

  // ContactのCRUD処理(初回時ロード)
  useEffect(() => {
    setGroups(getGroups());
  }, []);

  /**
   * グループを追加する関数。
   * @param {Group} group - 追加するグループオブジェクト。
   * @returns {boolean} 登録に成功すれば true、失敗すれば false。
   */
  const addGroup = (group: Group): boolean => {
    if (groups.some((g) => g.name === group.name)) return false; // 重複チェック
    const updatedGroups = [...groups, group];

    setGroups(updatedGroups);
    saveGroups(updatedGroups);
    return true;
  };

  /**
   * グループを更新する関数。
   * @param {Group} group - 更新するグループオブジェクト。
   * @returns {boolean} 更新に成功すれば true、失敗すれば false。
   */
  const updateGroup = (group: Group): boolean => {
    if (groups.some((g) => g.name === group.name && g.id !== group.id))
      return false; // 重複チェック
    const updatedGroups = groups.map((g) =>
      g.id === group.id ? { ...g, name: group.name } : g
    );
    setGroups(updatedGroups);
    saveGroups(updatedGroups);
    return true;
  };

  /**
   * グループを削除する関数。
   * @param {string} id - 削除するグループの ID。
   * @returns {void} この関数は値を返さず、連絡先削除し、リストを更新する。
   */
  const handleDeleteGroup = (id: string): void => {
    deleteGroup(id);
    setGroups(getGroups());
  };
  return (
    <GroupContext.Provider
      value={{ groups, addGroup, updateGroup, handleDeleteGroup }}
    >
      {children}
    </GroupContext.Provider>
  );
}
export { GroupProvider, GroupContext };
