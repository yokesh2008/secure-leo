import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { Bell, Check, Trash2, X, Shield, Award, AlertTriangle, Info } from 'lucide-react';

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-textDim text-cyber-textDim hover:text-cyber-textBright transition-colors"
        title="Notifications & Alerts"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyber-neonGreen text-cyber-bg text-[10px] font-mono font-black flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-cyber-panel border border-cyber-border shadow-2xl z-50 overflow-hidden font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3.5 bg-cyber-card border-b border-cyber-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyber-neonCyan" />
                <span className="font-bold text-cyber-textBright uppercase">Security Alerts</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyber-surface border border-cyber-border text-cyber-textMuted">
                  {notifications.length}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-1 rounded text-cyber-textMuted hover:text-cyber-neonGreen"
                    title="Mark all as read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={clearNotifications}
                  className="p-1 rounded text-cyber-textMuted hover:text-cyber-neonRed"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded text-cyber-textMuted hover:text-cyber-textBright"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-cyber-border/40 p-1">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-cyber-textMuted">
                  No security notifications.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl transition-colors ${
                      n.read ? 'opacity-70 hover:opacity-100' : 'bg-cyber-surface/60'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          n.type === 'achievement'
                            ? 'bg-cyber-neonGreen'
                            : n.type === 'success'
                            ? 'bg-cyber-neonCyan'
                            : n.type === 'warning'
                            ? 'bg-cyber-neonAmber'
                            : 'bg-cyber-neonRed'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-cyber-textBright uppercase truncate">
                            {n.title}
                          </span>
                          <span className="text-cyber-textMuted flex-shrink-0 ml-1">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-cyber-textDim mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
