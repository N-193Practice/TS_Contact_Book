import { JSX } from 'react';
import { Outlet } from 'react-router';
import styles from './RootLayout.module.css';
import ApplicationHeader from '../../components/ApplicationHeader/ApplicationHeader';

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
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
