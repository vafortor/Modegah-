
import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Bell, BellRing } from 'lucide-react';
import { Notification } from '../types';

interface NotificationTrayProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const NotificationTray: React.FC<NotificationTrayProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {notifications.map((notif) => (
        <Toast key={notif.id} notification={notif} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const Toast: React.FC<{ notification: Notification; onDismiss: (id: string) => void }> = ({ notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle2 className="text-green-600" size={20} />,
      progress: 'bg-green-500',
      title: 'text-green-800'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <AlertCircle className="text-red-600" size={20} />,
      progress: 'bg-red-500',
      title: 'text-red-800'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: <AlertCircle className="text-amber-600" size={20} />,
      progress: 'bg-amber-500',
      title: 'text-amber-800'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="text-blue-600" size={20} />,
      progress: 'bg-blue-500',
      title: 'text-blue-800'
    }
  }[notification.type];

  return (
    <div className={`pointer-events-auto w-full p-4 rounded-2xl border ${styles.bg} ${styles.border} shadow-2xl animate-in slide-in-from-right duration-300 relative overflow-hidden group`}>
      <div className="flex gap-3">
        <div className="shrink-0 pt-0.5">{styles.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-bold truncate ${styles.title}`}>{notification.title}</h4>
          <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{notification.message}</p>
        </div>
        <button 
          onClick={() => onDismiss(notification.id)}
          className="shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
        >
          <X size={16} />
        </button>
      </div>
      
      {/* Progress Bar for dismissal */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-black/5">
        <div className={`h-full ${styles.progress} transition-all duration-[5000ms] ease-linear w-0 animate-toast-progress`} />
      </div>

      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-toast-progress {
          animation: toast-progress 5000ms linear forwards;
        }
      `}</style>
    </div>
  );
};

export default NotificationTray;
