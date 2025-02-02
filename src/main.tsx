import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './App.tsx';
// import { insertTestData } from './utils/testData.ts';
// import { getContacts } from './utils/localStorage.ts';

// if (getContacts().length === 0) {
//   insertTestData();
// }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </StrictMode>
);
