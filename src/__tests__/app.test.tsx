import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, it, expect } from 'vitest';
import { CONTACTS_STORAGE_KEY, GROUPS_STORAGE_KEY } from '../utils/const';
import App from '../App';
import { MESSAGES } from '../utils/message';

describe('連絡先リスト', () => {
  // 連絡先リストを作成する
  const contacts = [
    { id: '1', name: 'John Doe', phone: '023-456-7890' },
    { id: '2', name: 'Ann Doe', phone: '023-456-7890' },
  ];

  const groups = [
    { id: '1', name: 'Family' },
    { id: '2', name: 'Friends' },
  ];

  const { rerender } = render(<App />);

  beforeEach(() => {
    // ローカルストレージをクリアする
    global.localStorage.clear();
  });

  it('連絡先を表示する', async () => {
    // 連絡先をローカルストレージに保存する
    global.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));

    // アプリをレンダリングする
    rerender(<App />);

    // 連絡先要素を取得する
    const contactsElements = await screen.findAllByText(/氏名/);

    // 連絡先の数が一致するか確認する
    expect(contactsElements).toHaveLength(contacts.length);
  });

  it('ユーザーが連絡先をクリックすると、連絡先の詳細が表示される', async () => {
    const user = userEvent.setup();

    // 連絡先をローカルストレージに保存する
    global.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));

    // アプリをレンダリングする
    rerender(<App />);

    // 連絡先要素を取得する
    const contactNameElement = await screen.findByText(
      RegExp(contacts[0].name)
    );
    const contactCard = contactNameElement.closest('li');
    const editButton = await within(contactCard as HTMLElement).findByLabelText(
      '編集'
    );

    await user.click(editButton);

    // 連絡先の詳細が表示されるのを待つ
    await screen.findByText(/連絡先を編集/i);

    // 連絡先の詳細が表示されるか確認する
    const nameField = await screen.findByLabelText('名前');
    expect(nameField.getAttribute('value')).toBe(contacts[0].name);
    const phoneField = await screen.findByLabelText('電話番号');
    expect(phoneField.getAttribute('value')).toBe(contacts[0].phone);
    const memoField = await screen.findByLabelText('メモ');
    expect(memoField.getAttribute('value')).toBe(null);
    const groupSelect = await screen.findByRole('combobox');
    expect(groupSelect.getAttribute('value')).toBe(null);
  });

  it('ユーザーがグループをクリックすると、グループリストページが表示される', async () => {
    const user = userEvent.setup();

    // 連絡先をローカルストレージに保存する
    global.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));

    // グループをローカルストレージに保存する
    global.localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));

    // アプリをレンダリングする
    rerender(<App />);

    // グループボタンを取得する
    const groupButton = await screen.findByText(/groups/i);

    await user.click(groupButton);

    // グループページが表示されるか確認する
    const main = await screen.findByRole('main');
    const groupList = await within(main).findByRole('list');
    const groupItems = await within(groupList).findAllByRole('listitem');

    expect(groupItems).toHaveLength(groups.length);

    for (const group of groups) {
      await within(groupList).findByText(group.name);
    }

    const contactsButton = await screen.findByText(/contacts/i);

    await user.click(contactsButton);
  });

  it('ユーザーがグループの編集をクリックすると、グループ編集ページが表示される', async () => {
    const user = userEvent.setup();

    // 連絡先をローカルストレージに保存する
    global.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));

    // グループをローカルストレージに保存する
    global.localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));

    // アプリをレンダリングする
    rerender(<App />);

    // グループボタンを取得する
    const groupButton = await screen.findByText(/groups/i);

    await user.click(groupButton);

    // グループページが表示されるか確認する
    const main = await screen.findByRole('main');
    const groupList = await within(main).findByRole('list');

    const groupNameItem = await within(groupList).findByText(groups[0].name);
    const editButton = await within(
      groupNameItem.closest('li') as HTMLElement
    ).findByLabelText('編集');

    await user.click(editButton);

    // グループ編集ページが表示されるか確認する
    await screen.findByText(/グループを編集/i);

    const nameField = await screen.findByLabelText('グループ名');
    expect(nameField.getAttribute('value')).toBe(groups[0].name);

    const contactsButton = await screen.findByText(/contacts/i);

    await user.click(contactsButton);
  });

  it('ユーザーがグループの追加をクリックすると、グループ追加ページが表示される', async () => {
    const user = userEvent.setup();

    // 連絡先をローカルストレージに保存する
    global.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));

    // グループをローカルストレージに保存する
    global.localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));

    // アプリをレンダリングする
    rerender(<App />);

    // グループボタンを取得する
    const groupButton = await screen.findByText(/groups/i);

    await user.click(groupButton);

    const addButton = await screen.findByLabelText('新規作成');

    await user.click(addButton);

    // グループ追加ページが表示されるか確認する
    await screen.findByText(/新しいグループを作成/i);

    await user.type(screen.getByLabelText('グループ名'), 'New Group');

    await user.click(screen.getByText('作成'));

    // グループが追加されたか確認する
    const main = await screen.findByRole('main');
    const groupList = await within(main).findByRole('list');
    const groupItems = await within(groupList).findAllByRole('listitem');
    expect(groupItems).toHaveLength(groups.length + 1);
    await within(groupList).findByText('New Group');

    // 成功メッセージ
    await screen.findByText(MESSAGES.GROUP.CREATE_SUCCESS);

    const contactsButton = await screen.findByText(/contacts/i);

    await user.click(contactsButton);
  });
});
