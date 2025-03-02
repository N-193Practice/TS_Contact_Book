import { createBrowserRouter, RouterProvider } from 'react-router';
import { ContactProvider } from './contexts/ContactContext';
import { GroupProvider } from './contexts/GroupContext';
import RootLayout from './pages/RootLayout/RootLayout';
import Groups from './pages/Groups/Groups/Groups';
import Contacts from './pages/Contacts/Contacts';
import Group from './pages/Groups/Group/Group';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import {
  getContactsList,
  getContactsEdit,
  getContactsNew,
  importContacts,
  getGroupsList,
  groupAction,
  contactsAction,
  getGroup,
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
        action: contactsAction,
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
        path: 'contacts/csv',
        action: importContacts,
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
        element: <Group />,
        loader: getGroup,
        action: groupAction,
      },
      {
        path: 'groups/edit/:id',
        element: <Group />,
        loader: getGroup,
        action: groupAction,
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
