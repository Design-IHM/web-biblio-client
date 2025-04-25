import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import AuthenticationPage from './pages/AuthenticationPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardLayout from './layouts/DashboardLayout';
import ProfilePage from './pages/dashboard/Profile';
import ReservationsPage from './pages/dashboard/ReservationsPage';
import StatisticsPage from './pages/dashboard/StatisticsPage';
import CartPage from './pages/dashboard/CartPage';
import CataloguePage from './pages/CataloguePage';
import BookDetailsPage from './pages/BookDetailsPage';


/*
import ReservationsPage from './pages/dashboard/ReservationsPage';
import ChatPage from './pages/dashboard/ChatPage';
import HistoryPage from './pages/dashboard/HistoryPage';
import NotificationsPage from './pages/dashboard/NotificationsPage';
*/
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      
      
    ],
  },
  {
    path: '/auth',
    element: <AuthenticationPage />,
  },
  {
    path: '/catalogue',
    element: <CataloguePage />,
  },
    {
      path: '/book/:id',
      element: <BookDetailsPage />,
    },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <ProfilePage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'statistics',
        element: <StatisticsPage />,
      },
      
      {
        path: 'reservations',
        element: <ReservationsPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },/*
      
      
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },*/
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;