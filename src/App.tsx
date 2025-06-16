import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from './contexts/ConfigContext';
// import DebugConfig from './components/DebugConfig';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ReservationsPage from './pages/profile/ReservationPage';
import NotificationsPage from './pages/profile/NotificationsPage';
import HistoryPage from './pages/profile/ConsultationsPage';
import ChatPage from './pages/profile/ChatPage';
import BookDetailsPage from './pages/BookDetailsPage';
import AuthPage from "./pages/AuthPage";
import BooksPage from "./pages/BooksPage";
import ThesisPage from "./pages/ThesisPage";
import ThesisDetailsPage from "./pages/ThesisDetailsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ProfileLayout from "./layouts/ProfileLayout";
import EmpruntPage from "./pages/profile/EmpruntsPage";
import {ToastContainer} from "react-toastify";

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
                path: 'reservations',
                element: <ReservationsPage />,
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
                element: <EmpruntPage />,
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
            <ToastContainer position="top-right" autoClose={3000} />
            {/*<DebugConfig />*/}
        </ConfigProvider>
    );
}

export default App;
