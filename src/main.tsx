import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { insertTestData } from './utils/testData';
import { getContacts } from './utils/localStorage';

if (getContacts().length === 0) {
  insertTestData();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
