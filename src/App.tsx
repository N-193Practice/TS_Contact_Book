import { RouterProvider } from 'react-router';
import router from './utils/routes';
import { createBrowserRouter } from 'react-router';

function App() {
  return <RouterProvider router={createBrowserRouter(router)} />;
}
export default App;
