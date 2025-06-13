// src/pages/dashboard/NotificationsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService, Notification } from '../../services/notificationService';
import { authService } from '../../services/auth/authService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Bell, CheckCircle, Info, AlertTriangle, Trash2, MailOpen } from 'lucide-react';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            const user = await authService.getCurrentUser();
            if (user && user.id) {
                const userNotifications = await notificationService.getNotificationsForUser(user.id);
                setNotifications(userNotifications);
            }
            setLoading(false);
        };
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        await notificationService.markAsRead(id);
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const handleMarkAllAsRead = async () => {
        const user = await authService.getCurrentUser();
        if (user && user.id) {
            await notificationService.markAllAsRead(user.id);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
    };

    if (loading) {
        return <LoadingSpinner size="lg" text="Chargement des notifications..." />;
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-secondary">Notifications</h1>
                    <p className="text-gray-500 mt-1">Retrouvez ici toutes vos alertes et messages.</p>
                </div>
                <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors"
                >
                    <MailOpen size={18} />
                    Marquer tout comme lu
                </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg">
                {notifications.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {notifications.map(notif => (
                            <NotificationItem key={notif.id} notification={notif} onMarkAsRead={handleMarkAsRead} />
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-20">
                        <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-secondary">Boîte de réception vide</h3>
                        <p className="text-gray-500 mt-2">Vous n'avez aucune nouvelle notification pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Composant pour un item de notification
const NotificationItem = ({ notification, onMarkAsRead }: { notification: Notification, onMarkAsRead: (id: string) => void }) => {
    const navigate = useNavigate();
    
    const icons = {
        success: <CheckCircle className="text-green-500" />,
        reminder: <Bell className="text-yellow-500" />,
        alert: <AlertTriangle className="text-red-500" />,
        info: <Info className="text-blue-500" />,
    };

    const handleClick = () => {
        if (!notification.read) {
            onMarkAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
    };
    
    return (
        <li
            onClick={handleClick}
            className={`flex items-start gap-4 p-6 transition-all duration-300 cursor-pointer ${
                notification.read ? 'bg-white' : 'bg-primary/5 hover:bg-primary/10'
            }`}
        >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                {icons[notification.type]}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-secondary">{notification.title}</h4>
                    {!notification.read && (
                        <div className="w-2.5 h-2.5 bg-primary rounded-full" title="Non lue"></div>
                    )}
                </div>
                <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                <span className="text-xs text-gray-400 mt-2 block">
                    {notification.timestamp.toDate().toLocaleString('fr-FR')}
                </span>
            </div>
            <button className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={16} />
            </button>
        </li>
    );
};

export default NotificationsPage;