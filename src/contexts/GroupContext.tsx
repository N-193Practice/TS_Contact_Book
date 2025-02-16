import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  JSX,
  useCallback,
} from 'react';
import { Group } from '../models/Group';
import {
  getGroups,
  saveGroups,
  deleteGroup,
  getContacts,
  saveContacts,
} from '../utils/localStorage';
import { validateGroup } from '../utils/validation';
import { AppError } from '../utils/errors';

export type GroupContextType = {
  groups: Group[];
  addGroup: (group: Group) => boolean;
  updateGroup: (group: Group) => boolean;
  handleDeleteGroup: (id: string) => void;
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
  const [recentlyCreatedGroupId, setRecentlyCreatedGroupId] = useState<
    string | null
  >(null);

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
    if (!validateGroup(group, groups)) return false; // バリデーション適用

    const updatedGroups = [...groups, group];
    setGroups(updatedGroups);
    saveGroups(updatedGroups);
    setRecentlyCreatedGroupId(group.id);
    return true;
  };

  /**
   * グループを更新する関数。
   * @param {Group} group - 更新するグループオブジェクト。
   * @returns {boolean} 更新に成功すれば true、失敗すれば false。
   */
  const updateGroup = (group: Group): boolean => {
    if (!validateGroup(group, groups)) return false; // バリデーション適用
    const updatedGroups = groups.map((g) =>
      g.id === group.id ? { ...g, name: group.name } : g
    );
    setGroups(updatedGroups);
    saveGroups(updatedGroups);
    return true;
  };

  /**
   * useCallbackを使用し、グループを削除する関数。
   * @param {string} id - 削除するグループの ID。
   * @returns {void} この関数は値を返さず、連絡先削除し、リストを更新する。
   */
  const handleDeleteGroup = useCallback((id: string): void => {
    try {
      deleteGroup(id);
      const updatedGroups = getGroups();
      setGroups(updatedGroups);

      const contacts = getContacts();
      const updatedContacts = contacts.map((contact) =>
        contact.groupId === id ? { ...contact, groupId: null } : contact
      );

      saveContacts(updatedContacts);
    } catch (error) {
      throw new AppError(
        `Group with ID ${id} not found:${(error as Error).message}`,
        404
      );
    }
  }, []);

  /**
   * グループの編集を開始する関数。
   * @returns {void} この関数は値を返さず、グループの編集を開始し、リストを更新する。また、最後に作成したグループの ID を記憶する。
   */
  const clearRecentlyCreatedGroupId = () => {
    setRecentlyCreatedGroupId(null);
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        addGroup,
        updateGroup,
        handleDeleteGroup,
        recentlyCreatedGroupId,
        clearRecentlyCreatedGroupId,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}
export { GroupProvider, GroupContext };
