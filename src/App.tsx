import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { ContactProvider } from './contexts/ContactContext';
import Home from './pages/Home/Home';
import GroupNew from './pages/GroupNew/GroupNew';
import GroupEdit from './pages/GroupEdit/GroupEdit';
import GroupDelete from './pages/GroupDelete/GroupDelete';
import Error from './pages/Error';
import { GroupProvider } from './contexts/GroupContext';

function App() {
  return (
    <GroupProvider>
      <ContactProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/groups/new" element={<GroupNew />} />
            <Route path="/groups/edit/:id" element={<GroupEdit />} />
            <Route path="/groups/delete/:id" element={<GroupDelete />} />
            <Route path="/*" element={<Error />} />
          </Routes>
        </Router>
      </ContactProvider>
    </GroupProvider>
  );
}
export default App;
