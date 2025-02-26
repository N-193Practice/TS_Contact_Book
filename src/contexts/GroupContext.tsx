import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  JSX,
  useCallback,
} from 'react';
import { Group } from '../models/types';
import {
  getGroups,
  saveGroups,
  deleteGroup,
  getContacts,
  saveContacts,
} from '../utils/localStorage';
import { validateGroup } from '../utils/validation';
import { AppError } from '../utils/errors';

/**
 * グループのコンテキスト。
 * @property {Group[]} groups - グループの配列。
 * @property {(groups: Group[]) => void} setGroups - グループの配列を更新する関数。
 * @property {(group: Group) => boolean} addGroup - グループの追加を行う関数。
 * @property {(group: Group) => boolean} updateGroup - グループの更新を行う関数。
 * @property {() => void} reloadGroups - グループのリストを再読み込みする関数。
 * @property {(id: string) => void} handleDeleteGroup - グループの削除を行う関数。
 * @property {(string | null)} errorMessage - エラーメッセージ。
 * @property {(message: string | null) => void} setErrorMessage -エラーメッセージを設定する関数。
 * @property {(string | null)} successMessage - 成功メッセージ。
 * @property {(message: string | null) => void} setSuccessMessage - 成功メッセージを設定する関数。
 */
export type GroupContextType = {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => boolean;
  updateGroup: (group: Group) => boolean;
  reloadGroups: () => void;
  handleDeleteGroup: (id: string) => void;
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
  successMessage: string | null;
  setSuccessMessage: (message: string | null) => void;
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

  return (
    <GroupContext.Provider
      value={{
        groups,
        setGroups,
        addGroup,
        updateGroup,
        reloadGroups,
        handleDeleteGroup,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}
export { GroupProvider, GroupContext };
