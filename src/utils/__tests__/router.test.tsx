import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, it, expect } from 'vitest';
import router from '../routes';
import { CONTACTS_STORAGE_KEY } from '../const';
import { MESSAGES } from '../message';

describe('React Router', () => {
  // 連絡先リストを作成する
  const contacts = [
    { id: '1', name: 'John Doe', phone: '023-456-7890' },
    { id: '2', name: 'Ann Doe', phone: '023-456-7890' },
  ];

  const appRoutes = createMemoryRouter(router, {
    initialEntries: ['/'],
  });

  const { rerender } = render(<RouterProvider router={appRoutes} />);

  beforeEach(() => {
    // ローカルストレージをクリアする
    global.localStorage.clear();
  });

  it('ホームページをレンダリングする /', async () => {
    // メモリルーターを作成する
    const appRoutes = createMemoryRouter(router, {
      initialEntries: ['/'],
    });

    // アプリをレンダリングする
    rerender(<RouterProvider router={appRoutes} />);

    // ホームコンポーネントがレンダリングされるのを待つ
    await screen.findByText('Contact Book');
  });

  it('ローカルストレージから連絡先をレンダリングする /', async () => {
    // 連絡先をローカルストレージに保存する
    global.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));

    // メモリルーターを作成する
    const appRoutes = createMemoryRouter(router, {
      initialEntries: ['/'],
    });

    // アプリをレンダリングする
    rerender(<RouterProvider router={appRoutes} />);

    // 連絡先要素を取得する
    const contactsElements = await screen.findAllByText(/氏名/);

    // 連絡先の数が一致するか確認する
    expect(contactsElements).toHaveLength(contacts.length);
  });

  it('連絡先のカードをすべてレンダリングする /', async () => {
    // 連絡先をローカルストレージに保存する
    global.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));

    // メモリルーターを作成する
    const appRoutes = createMemoryRouter(router, {
      initialEntries: ['/'],
    });

    // アプリをレンダリングする
    rerender(<RouterProvider router={appRoutes} />);

    // 連絡先ごとにカードを確認する
    for (const contact of contacts) {
      const name = await screen.findByText(new RegExp(contact.name, 'i'));
      const card = name.closest('li');
      expect(card).not.toBeNull();
      expect(card?.querySelector('a')?.getAttribute('href')).toBe(
        `/contacts/edit/${contact.id}`
      );
      expect(card?.querySelector('button')?.getAttribute('aria-label')).toBe(
        '削除'
      );
    }
  });

  it('連絡先の編集ページをレンダリングする /contacts/edit/:id', async () => {
    // 連絡先をローカルストレージに保存する
    global.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));

    // メモリルーターを作成する
    const appRoutes = createMemoryRouter(router, {
      initialEntries: ['/contacts/edit/1'],
    });

    // アプリをレンダリングする
    rerender(<RouterProvider router={appRoutes} />);

    // 連絡先の名前を取得する
    await screen.findByText(/連絡先を編集/i);

    const nameField = await screen.findByLabelText('名前');
    expect(nameField.getAttribute('value')).toBe('John Doe');
    const phoneField = await screen.findByLabelText('電話番号');
    expect(phoneField.getAttribute('value')).toBe('023-456-7890');
    const memoField = await screen.findByLabelText('メモ');
    expect(memoField.getAttribute('value')).toBe(null);
    const groupSelect = await screen.findByRole('combobox');
    expect(groupSelect.getAttribute('value')).toBe(null);
  });

  it('連絡先の新規作成ページをレンダリングする /contacts/new', async () => {
    // 連絡先をローカルストレージに保存する
    global.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));

    // メモリルーターを作成する
    const appRoutes = createMemoryRouter(router, {
      initialEntries: ['/contacts/new'],
    });

    // アプリをレンダリングする
    rerender(<RouterProvider router={appRoutes} />);

    // 連絡先の名前を取得する
    await screen.findByText(/新しい連絡先を追加/i);

    const nameField = await screen.findByLabelText('名前');
    expect(nameField.getAttribute('value')).toBe('');
    const phoneField = await screen.findByLabelText('電話番号');
    expect(phoneField.getAttribute('value')).toBe('');
    const memoField = await screen.findByLabelText('メモ');
    expect(memoField.getAttribute('value')).toBe(null);
    const groupSelect = await screen.findByRole('combobox');
    expect(groupSelect.getAttribute('value')).toBe(null);
  });

  it('新しい連絡先を作成する', async () => {
    const user = userEvent.setup();

    // 連絡先をローカルストレージに保存する
    global.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify([]));

    // メモリルーターを作成する
    const appRoutes = createMemoryRouter(router, {
      initialEntries: ['/contacts/new'],
    });

    // アプリをレンダリングする
    rerender(<RouterProvider router={appRoutes} />);

    // 連絡先の名前を取得する
    await screen.findByText(/新しい連絡先を追加/i);

    const nameField = await screen.findByLabelText('名前');
    const phoneField = await screen.findByLabelText('電話番号');
    const memoField = await screen.findByLabelText('メモ');

    // 連絡先の情報を入力する
    await user.type(nameField, 'Jane Doe');
    await user.type(phoneField, '023-456-7890');
    await user.type(memoField, 'This is a test');

    // 保存ボタンをクリックする
    await user.click(await screen.findByText('保存'));

    // 連絡先が追加されたことを確認する
    await screen.findByText(new RegExp('Jane Doe', 'i'));
  });

  it('連絡先を削除する', async () => {
    const user = userEvent.setup();

    // 連絡先をローカルストレージに保存する
    global.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));

    // メモリルーターを作成する
    const appRoutes = createMemoryRouter(router, {
      initialEntries: ['/'],
    });

    // アプリをレンダリングする
    rerender(<RouterProvider router={appRoutes} />);

    const contactName = await screen.findByText(new RegExp('John Doe', 'i'));
    const card = contactName.closest('li');

    // 削除ボタンを取得する
    const deleteButton = card?.querySelector('button[aria-label="削除"]');

    // 削除ボタンをクリックする
    await user.click(deleteButton as Element);

    // 削除確認ダイアログが表示されるのを待つ
    const deleteTitle = await screen.findByText(
      new RegExp(MESSAGES.COMMON.CONFIRM_DELETE, 'i')
    );
    const deleteDialog = deleteTitle.closest('div[role="dialog"]');
    const { findByText } = within(deleteDialog as HTMLElement);
    const deleteButtonDialog = await findByText('削除');

    // 削除ボタンをクリックする
    await user.click(deleteButtonDialog);

    await waitFor(() => {
      // 他の連絡先がまだ存在していることを確認する
      const annDoe = screen.queryByText(new RegExp('Ann Doe', 'i'));
      expect(annDoe).not.toBeNull();

      // 削除された連絡先が存在しないことを確認する
      const johnDoe = screen.queryByText(new RegExp('John Doe', 'i'));
      expect(johnDoe).toBeNull();
    });
  });
});
