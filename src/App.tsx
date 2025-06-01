import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from './contexts/ConfigContext';
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
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);

function App() {
    return (
        <ConfigProvider>
            <RouterProvider router={router} />
        </ConfigProvider>
    );
}

export default App;
