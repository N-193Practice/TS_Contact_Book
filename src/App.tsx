import { createBrowserRouter, RouterProvider } from 'react-router';
import { ContactProvider } from './contexts/ContactContext';
import { GroupProvider } from './contexts/GroupContext';
import Root from './pages/RootLayout/Root';
import Contacts from './pages/Home/Home';
import GroupNew from './pages/GroupNew/GroupNew';
import GroupEdtit from './pages/GroupEdit/GroupEdit';
import Error from './pages/Error/Error';
import {
  getContactsList,
  getContactsEdit,
  getContactsNew,
  getGroupsList,
  groupAction,
  getGroupEdit,
} from './utils/contactServices';
import Groups from './pages/Groups/Groups';

// ルーターの作成
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Contacts />,
        loader: getContactsList,
      },
      {
        path: 'contacts/new',
        element: <Contacts />,
        loader: getContactsNew,
      },
      {
        path: 'contacts/edit/:id',
        element: <Contacts />,
        loader: getContactsEdit,
      },
      {
        path: 'groups',
        element: <Groups />,
        loader: getGroupsList,
      },
      {
        path: 'groups/delete/:id',
        action: groupAction,
      },
      {
        path: 'groups/new',
        element: <GroupNew />,
      },
      {
        path: 'groups/edit/:id',
        element: <GroupEdtit />,
        loader: getGroupEdit,
      },
    ],
  },
]);

function App() {
  return (
    <ContactProvider>
      <GroupProvider>
        <RouterProvider router={router} />
      </GroupProvider>
    </ContactProvider>
  );
}
export default App;
