import { JSX } from 'react';
import { Outlet } from 'react-router';
import styles from './RootLayout.module.css';
import ApplicationHeader from '../../components/ApplicationHeader/ApplicationHeader';
import { ContactProvider } from '../../contexts/ContactContext';
import { GroupProvider } from '../../contexts/GroupContext';

/**
 * `RootLayout` コンポーネント
 * ルートレイアウトのレイアウトを表示する。
 * @returns {JSX.Element} ルートレイアウトの UI を返す。
 */
function RootLayout(): JSX.Element {
  return (
    <div className={styles.container}>
      <ApplicationHeader />
      <main className={styles.main}>
        <ContactProvider>
          <GroupProvider>
            <Outlet />
          </GroupProvider>
        </ContactProvider>
      </main>
    </div>
  );
}

export default RootLayout;
