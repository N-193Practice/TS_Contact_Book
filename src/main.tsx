import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// import { insertTestData } from './utils/testData.ts';
// import { getContacts } from './utils/localStorage.ts';

// if (getContacts().length === 0) {
//   insertTestData();
// }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
