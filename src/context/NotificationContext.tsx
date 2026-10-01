import React, { createContext, useContext, useState } from 'react';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: ToastNotification[];
  toasts: ToastNotification[];
  showToast: (type: ToastNotification['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  unreadCount: number;
}

const INITIAL_NOTIFICATIONS: ToastNotification[] = [
  {
    id: 'notif-1',
    type: 'achievement',
    title: 'Achievement Unlocked: INJECTION ANALYST',
    message: 'Awarded 150 XP for analyzing SQL injection vector in Leo Shop.',
    timestamp: '10 mins ago',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'success',
    title: 'Report Triage Update',
    message: 'Report SL-REP-2026-081 was validated and marked as Resolved.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'info',
    title: 'System Environment Online',
    message: 'All simulated sandbox nodes (LEO-SANDBOX-01 to 04) are healthy.',
    timestamp: '1 day ago',
    read: true,
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<ToastNotification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (type: ToastNotification['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newNotification: ToastNotification = {
      id,
      type,
      title,
      message,
      timestamp: 'Just now',
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
    setToasts(prev => [...prev, newNotification]);

    // Auto dismiss toast after 4.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toasts,
        showToast,
        removeToast,
        markAllAsRead,
        clearNotifications,
        unreadCount,
      }}
    >
      {children}
      {/* Toast rendering container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 ${
              toast.type === 'achievement'
                ? 'bg-cyber-panel/95 border-cyber-neonGreen text-cyber-textBright shadow-glow-green'
                : toast.type === 'success'
                ? 'bg-cyber-panel/95 border-cyber-neonCyan text-cyber-textBright shadow-glow-cyan'
                : toast.type === 'warning'
                ? 'bg-cyber-panel/95 border-cyber-neonAmber text-cyber-textBright shadow-glow-amber'
                : toast.type === 'error'
                ? 'bg-cyber-panel/95 border-cyber-neonRed text-cyber-textBright shadow-glow-red'
                : 'bg-cyber-panel/95 border-cyber-border text-cyber-textBright'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full animate-ping ${
                      toast.type === 'achievement'
                        ? 'bg-cyber-neonGreen'
                        : toast.type === 'success'
                        ? 'bg-cyber-neonCyan'
                        : toast.type === 'warning'
                        ? 'bg-cyber-neonAmber'
                        : 'bg-cyber-neonRed'
                    }`}
                  />
                  <h4 className="text-xs font-mono font-bold tracking-wide uppercase text-cyber-neonCyan">
                    {toast.title}
                  </h4>
                </div>
                <p className="mt-1 text-xs text-cyber-textDim leading-relaxed">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-cyber-textMuted hover:text-cyber-textBright text-sm ml-2 font-mono"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
