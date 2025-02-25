import { createBrowserRouter, RouterProvider } from 'react-router';
import { ContactProvider } from './contexts/ContactContext';
import { GroupProvider } from './contexts/GroupContext';
import RootLayout from './pages/RootLayout/RootLayout';
import Groups from './pages/Groups/Groups/Groups';
import Contacts from './pages/Contacts/Contacts';
import GroupNew from './pages/Groups/GroupNew/GroupNew';
import GroupEdtit from './pages/Groups/GroupEdit/GroupEdit';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import {
  getContactsList,
  getContactsEdit,
  getContactsNew,
  getGroupsList,
  groupAction,
  getGroupEdit,
} from './utils/contactServices';

// ルーターの作成
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
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
