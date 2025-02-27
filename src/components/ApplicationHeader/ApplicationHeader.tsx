import { JSX } from 'react';
import { NavLink, useLocation } from 'react-router';
import styles from './ApplicationHeader.module.css';
import { Button, Typography } from '@mui/material';

/**
 * `ApplicationHeader` コンポーネント
 * アプリケーションのヘッダー部分を表示する。(タイトル、Group/Contactのページへのナビゲーションボタン)
 * @returns {JSX.Element} ヘッダー部分の UI を返す。
 */
function ApplicationHeader(): JSX.Element {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.spacer}></div>
      <Typography className={styles.title}>Contact Book</Typography>
      <nav className={styles.navitagionSection}>
        <ul className={styles.navigationList}>
          {!/^\/(contacts(\/.*)?)?$/.test(location.pathname) && (
            <li className={styles.navigationItem}>
              <Button
                className={styles.navigationButton}
                component={NavLink}
                to="/"
              >
                Contacts
              </Button>
            </li>
          )}
          {!/^\/groups(\/.*)?$/.test(location.pathname) && (
            <li className={styles.navigationItem}>
              <Button
                className={styles.navigationButton}
                component={NavLink}
                to="/groups"
              >
                Groups
              </Button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default ApplicationHeader;
