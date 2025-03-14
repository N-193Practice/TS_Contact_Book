import RootLayout from '../pages/RootLayout/RootLayout';
import Groups from '../pages/Groups/Groups/Groups';
import Contacts from '../pages/Contacts/Contacts';
import Group from '../pages/Groups/Group/Group';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import {
  getContactsList,
  getContactsEdit,
  getContactsNew,
  importContacts,
  getGroupsList,
  groupAction,
  contactsAction,
  getGroup,
} from './contactServices';
import { RouteObject } from 'react-router';

const routes: RouteObject[] = [
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
        element: null,
        action: importContacts,
      },
      {
        path: 'groups',
        element: <Groups />,
        loader: getGroupsList,
      },
      {
        path: 'groups/delete/:id',
        element: null,
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
];

export default routes;
