import { ContactProvider } from './contexts/ContactContext';
import { GroupProvider } from './contexts/GroupContext';
import { RouterProvider, createBrowserRouter } from 'react-router';
import routes from './utils/routes';

const router = createBrowserRouter(routes);

function App() {
  return (
    <ContactProvider>
      <GroupProvider>
        <RouterProvider router={router} />;
      </GroupProvider>
    </ContactProvider>
  );
}
export default App;
