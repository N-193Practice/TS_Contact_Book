import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  ReactNode,
  JSX,
} from 'react';
import { Contact } from '../models/types';
import { GroupContext } from './GroupContext';
import {
  getContacts,
  saveContacts,
  deleteContact,
  resetGroupIdInContacts,
} from '../utils/localStorage';
import { validateContact } from '../utils/validation';

/**
 * ContactContextType は、連絡先コンテキストの構造を定義する。
 * @property {Contact[]} contacts - すべての連絡先のリスト。
 * @property {(contacts: Contact[]) => void} setContacts - 連絡先のリストを更新する関数。
 * @property {string} searchQuery - 現在の検索クエリ。
 * @property {(query: string) => void} setSearchQuery - 検索クエリを更新する関数。
 * @property {React.MutableRefObject<{ [key: string]: HTMLLIElement | null }>} listRefs - 連絡先リスト要素への参照。
 * @property {boolean} openDialog - 連絡先ダイアログが開いているかどうかを示します。
 * @property {(open: boolean) => void} setOpenDialog - 連絡先ダイアログを開くか閉じるかする関数。
 * @property {Contact | null} editContact - 編集中の連絡先 (ある場合)。
 * @property {(contact: Contact | null) => void} setEditContact - 現在編集中の連絡先を設定する関数。
 * @property {string[]} selectedContacts - 選択された連絡先 ID の配列。
 * @property {React.Dispatch<React.SetStateAction<string[]>>} setSelectedContacts - 選択された連絡先を設定する関数。
 * @property {(contact: Contact) => boolean} addContact - 新しい連絡先を追加する関数。
 * @property {(contact: Contact) => boolean} updateContact - 既存の連絡先を更新する関数。
 * @property {() => void} handleNewContact - 新しい連絡先の作成を処理する関数。
 * @property {(contact: Contact) => void} handleEditContact - 連絡先の編集を処理する関数。
 * @property {(id: string) => void} handleDeleteSelected - 選択された連絡先を削除する関数。
 * @property {(id: string) => void} handleDeleteAll - 削除する連絡先の選択を切り替える関数。
 * @property {() => void} handleDeleteMultiple - 選択した複数の連絡先を削除する関数。
 * @property {(letter: string) => void} handleAlphabetClick - アルファベットの選択を処理する関数。
 * @property {{ [key: string]: Contact[] }} groupedContacts - 先頭の文字でグループ化された連絡先。
 * @property {() => void} selectAllContacts - 全選択ボタンを押したときに呼び出される関数。
 * @property {() => void} deselectAllContacts - 全選択解除ボタンを押したときに呼び出される関数。
 */
export type ContactContextType = {
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  listRefs: React.RefObject<{ [key: string]: HTMLLIElement | null }>;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  editContact: Contact | null;
  setEditContact: (contact: Contact | null) => void;
  selectedContacts: string[];
  setSelectedContacts: React.Dispatch<React.SetStateAction<string[]>>;
  addContact: (contact: Contact) => boolean;
  updateContact: (contact: Contact) => boolean;
  handleNewContact: () => void;
  handleEditContact: (contact: Contact) => void;
  handleDeleteContact: (id: string) => void;
  handleMultipleSelected: (id: string) => void;
  handleDeleteMultiple: () => void;
  handleAlphabetClick: (letter: string) => void;
  groupedContacts: { [key: string]: Contact[] };
  selectAllContacts: () => void;
  deselectAllContacts: () => void;
  bulkImportContacts: (newContacts: Contact[]) => void;
};

// Context の作成
const ContactContext = createContext<ContactContextType | undefined>(undefined);

/**
 * プロバイダーの props 型定義
 * @property {ReactNode} children - プロバイダーによってラップされる子コンポーネント。
 */
type ContactProviderProps = {
  children: ReactNode;
};

/**
 * ContactProvider - 連絡先の状態管理を提供するプロバイダー。
 * @param {ContactProviderProps} props - `children` を受け取る。
 * @returns {JSX.Element} プロバイダー コンポーネント。
 */
function ContactProvider({ children }: ContactProviderProps): JSX.Element {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const listRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  // グループのコンテキストを取得
  const groupContext = useContext(GroupContext);
  const groups = useMemo(() => groupContext?.groups ?? [], [groupContext]);

  // ContactのCRUD処理(初回時ロード)
  const updateContacts = useCallback(() => {
    setContacts(getContacts());
  }, []);

  useEffect(() => {
    updateContacts();
  }, [groups, updateContacts]);

  /**
   * 検索クエリに基づいて連絡先をフィルタリングする。
   * @returns {Contact[]} フィルタリングされた連絡先のリスト。
   */
  const filteredContacts = useMemo<Contact[]>(() => {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  /**
   * アルファベットのクリック イベントを処理して、関連する連絡先までスクロールする。
   * @param {string} letter - AlphabetBar でクリックされた文字。
   * @returns {void} この関数は値を返さず、スクロールする。
   */
  const handleAlphabetClick = (letter: string): void => {
    listRefs.current[letter]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center', // 中央に配置する
      inline: 'nearest', // 横方向のスクロールを防ぐ
    });
  };

  /**
   * 連絡先を先頭文字でグループ化して表示する。(A-Z,あ-わ,#の順)
   * @returns {{ [key: string]: Contact[] }} - その文字に分類された連絡先の配列。
   */
  const groupedContacts = useMemo<{ [key: string]: Contact[] }>(() => {
    // 名前順にソート
    const sortedContacts = [...filteredContacts].sort((a, b) =>
      a.name.localeCompare(b.name, 'ja')
    );

    // グループ化するキーの順序
    const grouppOrder = [
      ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      'あ',
      'か',
      'さ',
      'た',
      'な',
      'は',
      'ま',
      'や',
      'ら',
      'わ',
      '#',
    ];

    // グループ化する空の配列を作成し、適切なグループへ分類する。
    const groups: { [key: string]: Contact[] } = {};
    sortedContacts.forEach((contact) => {
      const firstChar = contact.name[0].toUpperCase();

      // 日本語の五十音分類
      const firstLetter = /^[A-Z]/.test(firstChar)
        ? firstChar
        : /^[あ-おア-オ]/.test(firstChar)
        ? 'あ'
        : /^[か-こカ-コ]/.test(firstChar)
        ? 'か'
        : /^[さ-そサ-ソ]/.test(firstChar)
        ? 'さ'
        : /^[た-とタ-ト]/.test(firstChar)
        ? 'た'
        : /^[な-のナ-ノ]/.test(firstChar)
        ? 'な'
        : /^[は-ほハ-ホ]/.test(firstChar)
        ? 'は'
        : /^[ま-もマ-モ]/.test(firstChar)
        ? 'ま'
        : /^[やゆよヤユヨ]/.test(firstChar)
        ? 'や'
        : /^[ら-ろラ-ロ]/.test(firstChar)
        ? 'ら'
        : /^[わをんワヲン]/.test(firstChar)
        ? 'わ'
        : '#';

      // グループがない場合はグループを作成し、連絡先をグループへ追加する。
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(contact);
    });

    // グループをA-Z → あ-わ → # の順に並び替え
    const sortedGroupedContacts = Object.fromEntries(
      grouppOrder.filter((key) => groups[key]).map((key) => [key, groups[key]])
    );
    return sortedGroupedContacts;
  }, [filteredContacts]);

  /**
   * 新規作成用の編集ダイアログを開く。
   * フォームのデータを初期化し表示する。
   * @returns {void} この関数は値を返さず、ダイアログを開くだけ。
   */
  const handleNewContact = (): void => {
    setEditContact(null);
    setOpenDialog(true);
  };

  /**
   * 既存の連絡先情報を編集するためのダイアログを開く。
   * @param {Contact} contact - 編集対象の連絡先情報。
   * @returns {void} この関数は値を返さず、ダイアログを開くだけ。
   */
  const handleEditContact = (contact: Contact): void => {
    setEditContact(contact);
    setOpenDialog(true);
  };

  /**
   * セレクトボックスの全選択解除を実装する関数。
   * @returns {void} この関数は値を返さず、全リストのチェックボックスにチェックを入れる。
   */
  const selectAllContacts = (): void => {
    setSelectedContacts(contacts.map((contact) => contact.id));
  };

  /**
   * セレクトボックスの全選択解除を実装する関数。
   * @returns {void} この関数は値を返さず、選択状態を更新する。
   */
  const deselectAllContacts = (): void => {
    setSelectedContacts([]);
  };
  /**
   * 連絡先を追加する関数。
   * @param {Contact} contact - 追加する連絡先。
   * @returns {boolean} 追加に成功すれば true、失敗すれば false。
   */
  const addContact = (contact: Contact): boolean => {
    if (!validateContact(contact, contacts)) return false;

    let updatedContacts = [...contacts, contact];

    if (contact.groupId) {
      updatedContacts = resetGroupIdInContacts(contact.groupId); // groupId を null にする
    }

    setContacts(updatedContacts); // React の state を更新
    saveContacts(updatedContacts);

    return true;
  };

  /**
   * 連絡先を更新する関数。
   * @param {Contact} updatedContact - 更新する連絡先。
   * @returns {boolean} 更新に成功すれば true、失敗すれば false。
   */
  const updateContact = (updatedContact: Contact): boolean => {
    if (!validateContact(updatedContact, contacts, true)) return false;

    let updatedContacts = contacts.map((c) =>
      c.id === updatedContact.id ? updatedContact : c
    );

    if (updatedContact.groupId) {
      updatedContacts = resetGroupIdInContacts(updatedContact.groupId); // groupId を null にする
    }

    setContacts(updatedContacts); // React の state を更新
    saveContacts(updatedContacts);

    return true;
  };

  //CSVの一括処理できるようにする(新規、更新)
  const bulkImportContacts = (newContacts: Contact[]) => {
    setContacts((prevContacts) => {
      // IDが重複しないように既存データと新規データをマージ
      const updatedContacts = [...prevContacts];

      newContacts.forEach((newContact) => {
        const existingIndex = updatedContacts.findIndex(
          (c) => c.id === newContact.id
        );

        if (existingIndex !== -1) {
          // 既存データがある場合は更新
          updatedContacts[existingIndex] = {
            ...updatedContacts[existingIndex],
            ...newContact,
          };
        } else {
          // 既存データがない場合は新規追加
          updatedContacts.push(newContact);
        }
      });

      // LocalStorage に保存
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));

      return updatedContacts;
    });
    // グループデータはそのまま維持する
    const storedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
    localStorage.setItem('groups', JSON.stringify(storedGroups));
  };

  /**
   * 連絡先を削除する関数(個人のため)。
   * @param {string} id - 削除する連絡先の ID。
   * @returns {void} この関数は値を返さず、連絡先削除し、リストを更新する。
   */
  const handleDeleteContact = (id: string): void => {
    deleteContact(id);
    setContacts(getContacts());
  };

  /**
   * 削除対象をセレクトボックスで手動選択・解除する関数(複数選択可能)。
   * @param {string} id - 操作する連絡先の ID。
   * @returns {void} この関数は値を返さず、選択状態を更新する。
   */
  const handleMultipleSelected = (id: string): void => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  /**
   * セレクトボックスで選択された連絡先を削除する関数。
   * @returns {void} この関数は値を返さず、連絡先削除し、リストを更新する。
   */
  const handleDeleteMultiple = (): void => {
    if (selectedContacts.length === 0) {
      alert('削除する連絡先を選択してください');
      return;
    }
    selectedContacts.forEach((id) => deleteContact(id));
    setContacts(getContacts());
    setSelectedContacts([]);
  };

  return (
    <ContactContext.Provider
      value={{
        contacts,
        setContacts,
        searchQuery,
        setSearchQuery,
        listRefs,
        openDialog,
        setOpenDialog,
        editContact,
        setEditContact,
        selectedContacts,
        setSelectedContacts,
        addContact,
        updateContact,
        handleNewContact,
        handleEditContact,
        handleDeleteContact,
        handleMultipleSelected,
        handleDeleteMultiple,
        handleAlphabetClick,
        groupedContacts,
        selectAllContacts,
        deselectAllContacts,
        bulkImportContacts,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}

export { ContactProvider, ContactContext };
