import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from './contexts/ConfigContext';
// import DebugConfig from './components/DebugConfig';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ReservationsPage from './pages/profile/EmpruntsPage.tsx';
import NotificationsPage from './pages/profile/NotificationsPage';
import HistoryPage from './pages/profile/ConsultationsPage';
import ChatPage from './pages/profile/ChatPage';
import BookDetailsPage from './pages/BookDetailsPage';
import AuthPage from "./pages/AuthPage.tsx";
import BooksPage from "./pages/BooksPage.tsx";
import ThesisPage from "./pages/ThesisPage.tsx";
import ThesisDetailsPage from "./pages/ThesisDetailsPage.tsx";
import ProfilePage from "./pages/profile/ProfilePage.tsx";
import ProfileLayout from "./layouts/ProfileLayout.tsx";

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
        path: '/profile',
        element: <ProfileLayout />,
        children: [
            {
                index: true,
                element: <ProfilePage />,
            },
            {
                path: 'Chat',
                element: <ChatPage />,
            },
            {
                path: 'consultations',
                element: <HistoryPage />,
            },
            {
                path: 'notifications',
                element: <NotificationsPage />,
            },
            {
                path: 'emprunts',
                element: <ReservationsPage />,
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
