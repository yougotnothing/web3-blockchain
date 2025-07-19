import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: lazy(() => import('../App')),
    children: [
      {
        path: '/wallet',
        Component: lazy(() => import('components/wallet/wallet')),
      },
      {
        path: '/dashboard',
        Component: lazy(() => import('components/dashboard/dashboard')),
      },
      {
        path: '/market',
        Component: lazy(() => import('components/market/market')),
      },
    ],
  },
  {
    path: '/register',
    Component: lazy(() => import('components/register/Register')),
  },
  {
    path: '/login',
    Component: lazy(() => import('components/login/Login')),
  },
]);
