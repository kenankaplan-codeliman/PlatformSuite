import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@platform/ui';
import { router } from './app/router/routes';

export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
