import { Outlet } from 'react-router';
import styles from './Root.module.css';
import ApplicationHeader from '../../components/ApplicationHeader/ApplicationHeader';

function RootLayout() {
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
