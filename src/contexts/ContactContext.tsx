import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  ReactNode,
} from 'react';
import Contact from '../models/Contact';
import {
  getContacts,
  saveContacts,
  deleteContact,
} from '../utils/localStorage';

/**
 * ContactContextType は、連絡先コンテキストの構造を定義する。
 * @property {Contact[]} contacts - すべての連絡先のリスト。
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
 */
export type ContactContextType = {
  contacts: Contact[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  listRefs: React.MutableRefObject<{ [key: string]: HTMLLIElement | null }>;
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
  handleDeleteSelected: (id: string) => void;
  handleDeleteAll: (id: string) => void;
  handleDeleteMultiple: () => void;
  handleAlphabetClick: (letter: string) => void;
  groupedContacts: { [key: string]: Contact[] };
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

  // ContactのCRUD処理
  useEffect(() => {
    setContacts(getContacts());
  }, []);

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
   */
  const handleAlphabetClick = (letter: string) => {
    listRefs.current[letter]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center', // 中央に配置する
      inline: 'nearest', // 横方向のスクロールを防ぐ
    });
  };

  /**
   * 連絡先を先頭文字でグループ化して表示する。
   * @returns {{ [key: string]: Contact[] }} - 連絡先を先頭文字でグループ化する。
   */
  const groupedContacts = useMemo<{ [key: string]: Contact[] }>(() => {
    // 名前順にソート
    const sortedContacts = [...filteredContacts].sort((a, b) =>
      a.name.localeCompare(b.name, 'ja')
    );

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

      // グループがない場合はグループを作成
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(contact);
    });

    // グループをA-Z → あ-わ → # の順に並び替え
    const sortedGroupedContacts = Object.fromEntries(
      grouppOrder.filter((key) => groups[key]).map((key) => [key, groups[key]])
    );
    return sortedGroupedContacts;
  }, [filteredContacts]); // 新規作成ダイアログを開く

  const handleNewContact = () => {
    setEditContact(null);
    setOpenDialog(true);
  };

  /**
   * 編集ダイアログを開く。
   * @param {Contact} contact - 編集対象の連絡先。
   */
  const handleEditContact = (contact: Contact) => {
    setEditContact(contact);
    setOpenDialog(true);
  };

  /**
   * バリデーションを行い、連絡先の正当性をチェックする関数。
   * @param {Contact} contact - バリデーション対象の連絡先。
   * @param {boolean} [isEdit=false] - 編集時のバリデーション。(編集時はメモフィールドのバリデーションを行う)
   * @returns {boolean} バリデーションが成功すれば true、失敗すれば false。
   */
  const validateContact = (
    contact: Contact,
    isEdit: boolean = false
  ): boolean => {
    // 空白のチェック
    const trimmedName = contact.name.trim();
    const trimmedPhone = contact.phone.trim();
    if (!trimmedName || !trimmedPhone) {
      alert('名前と電話番号は必須です');
      return false;
    }

    // 名前の重複チェック(新規・編集の際)
    const currentContacts = [...contacts];
    const isDuplicate = currentContacts.some(
      (c) => c.name === trimmedName && (!isEdit || c.id !== contact.id)
    );
    if (isDuplicate) {
      alert('この名前の連絡先はすでに存在します');
      return false;
    }
    return true;
  };

  /**
   * 連絡先を追加する関数。
   * @param {Contact} contact - 追加する連絡先。
   * @returns {boolean} 追加に成功すれば true、失敗すれば false。
   */
  const addContact = (contact: Contact): boolean => {
    if (!validateContact(contact)) return false;

    const updatedContacts = [...contacts, contact];
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
    return true;
  };

  /**
   * 連絡先を更新する関数。
   * @param {Contact} updatedContact - 更新する連絡先。
   * @returns {boolean} 更新に成功すれば true、失敗すれば false。
   */
  const updateContact = (updatedContact: Contact): boolean => {
    if (!validateContact(updatedContact, true)) return false;

    const updatedContacts = contacts.map((c) =>
      c.id === updatedContact.id ? updatedContact : c
    );
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
    return true;
  };
  /**
   * 連絡先を削除する。
   * @param {string} id - 削除する連絡先の ID。
   */

  const handleDeleteSelected = (id: string) => {
    deleteContact(id);
    setContacts(getContacts());
  };

  /**
   * 削除対象を選択・解除する。
   * @param {string} id - 操作する連絡先の ID。
   */
  const handleDeleteAll = (id: string) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  // 選択したすべての連絡先を削除する。
  const handleDeleteMultiple = () => {
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
        handleDeleteSelected,
        handleDeleteAll,
        handleDeleteMultiple,
        handleAlphabetClick,
        groupedContacts,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}

export { ContactProvider, ContactContext };
