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
import { AppError } from '../utils/errors';

export type GroupContextType = {
  groups: Group[];
  addGroup: (group: Group) => boolean;
  updateGroup: (group: Group) => boolean;
  handleDeleteGroup: (id: string) => Promise<void>;
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
    if (groups.some((g) => g.name === group.name)) return false; // 重複チェック
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
  const handleDeleteGroup = useCallback(async (id: string): Promise<void> => {
    try {
      const existingGroups = getGroups();

      if (!existingGroups.some((group) => group.id === id)) {
        throw new AppError(`Group with ID ${id} not found`, 404);
      }

      deleteGroup(id);

      const updatedGroups = existingGroups.filter((group) => group.id !== id);
      setGroups(updatedGroups);

      const contacts = getContacts();
      const updatedContacts = contacts.map((contact) =>
        contact.groupId === id ? { ...contact, groupId: null } : contact
      );
      saveContacts(updatedContacts);
    } catch (error) {
      console.error(`Failed to delete group: ${error}`);
      throw new AppError(
        `Failed to delete group with ID ${id}: ${(error as Error).message}`,
        500
      );
    }
  }, []);

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
