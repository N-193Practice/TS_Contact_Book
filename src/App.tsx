import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { ContactProvider } from './contexts/ContactContext';
import Home from './pages/Home';
import Error from './pages/Error';

function App() {
  return (
    <ContactProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </ContactProvider>
  );
}

export default App;
