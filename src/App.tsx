import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { ContactProvider } from './contexts/ContactContext';
import { GroupProvider } from './contexts/GroupContext';
import Home from './pages/Home/Home';
import GroupNew from './pages/GroupNew/GroupNew';
import GroupEdtit from './pages/GroupEdit/GroupEdit';
import GroupDelete from './pages/GroupDelete/GroupDelete';
import Error from './pages/Error/Error';

function App() {
  return (
    <ContactProvider>
      <GroupProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/groups/new" element={<GroupNew />} />
            <Route path="/groups/edit/:id" element={<GroupEdtit />} />
            <Route path="/groups/delete/:id" element={<GroupDelete />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
      </GroupProvider>
    </ContactProvider>
  );
}
export default App;
