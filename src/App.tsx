import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from './contexts/ConfigContext';
// import DebugConfig from './components/DebugConfig';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardLayout from './layouts/DashboardLayout';
import ProfilePage from './pages/dashboard/Profile';
import ReservationsPage from './pages/dashboard/ReservationsPage';
import StatisticsPage from './pages/dashboard/StatisticsPage';
import CartPage from './pages/dashboard/CartPage';
import BookDetailsPage from './pages/BookDetailsPage';
import AuthPage from "./pages/AuthPage.tsx";
import BooksPage from "./pages/BooksPage.tsx";
import ThesisPage from "./pages/ThesisPage.tsx";
import ThesisDetailsPage from "./pages/ThesisDetailsPage.tsx";

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
        element: <AuthPage />,
    },
    {
        path: '/books',
        element: <BooksPage />,
    },
    {
        path: '/books/:id',
        element: <BookDetailsPage />,
    },
    {
        path: '/thesis',
        element: <ThesisPage />,
    },
    {
        path: '/thesis/:id',
        element: <ThesisDetailsPage />,
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
            {/*<DebugConfig />*/}
        </ConfigProvider>
    );
}

export default App;
