import React, {
  createContext,
  useContext,
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

// ContactContext の型定義
type ContactContextType = {
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
  addContact: (contact: Contact) => void;
  updateContact: (contact: Contact) => void;
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

// Provider の props 型定義
type ContactProviderProps = {
  children: ReactNode;
};

// Provider の作成
function ContactProvider({ children }: ContactProviderProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const listRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  // ContactのCRUD処理
  useEffect(() => {
    setContacts(getContacts());
  }, []);

  // SearchBarの検索処理
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  // 名前の先頭文字でグループ化
  const groupedContacts = useMemo(() => {
    // 名前順にソート
    const sortedContacts = [...filteredContacts].sort((a, b) =>
      a.name.localeCompare(b.name, 'ja')
    );

    // A-Z,日本語の五十音分類でグループ化
    return sortedContacts.reduce((acc, contact) => {
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
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(contact);

      // グループ内もソート
      acc[firstLetter].sort((a, b) => a.name.localeCompare(b.name, 'ja'));

      return acc;
    }, {} as { [key: string]: Contact[] });
  }, [filteredContacts]);

  // 連絡先を追加
  const addContact = (contact: Contact) => {
    // 名前がすでに存在するかチェック
    if (contacts.some((c) => c.name === contact.name)) {
      alert('この名前の連絡先はすでに存在します');
      return;
    }
    const updatedContacts = [...contacts, contact];
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
  };

  // 連絡先を編集
  const updateContact = (updatedContact: Contact) => {
    const updatedContacts = contacts.map((c) =>
      c.id === updatedContact.id ? updatedContact : c
    );
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
  };

  // 新規作成ダイアログを開く
  const handleNewContact = () => {
    setEditContact(null);
    setOpenDialog(true);
  };

  // 編集ダイアログを開く
  const handleEditContact = (contact: Contact) => {
    setEditContact(contact);
    setOpenDialog(true);
  };

  // 連絡先を削除
  const handleDeleteSelected = (id: string) => {
    deleteContact(id);
    setContacts(getContacts());
  };

  // 削除対象を選択して削除するトグル
  const handleDeleteAll = (id: string) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  // 選択した連絡先を削除
  const handleDeleteMultiple = () => {
    if (selectedContacts.length === 0) {
      alert('削除する連絡先を選択してください');
      return;
    }
    selectedContacts.forEach((id) => deleteContact(id));
    setContacts(getContacts());
    setSelectedContacts([]);
  };

  // AlphabetBar で選択した文字のリストをスクロール
  const handleAlphabetClick = (letter: string) => {
    listRefs.current[letter]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
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

// useContacts が適切な Provider 内で使用されているかをチェックするカスタムフック
function useContacts() {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
}

export { ContactProvider, useContacts };
