import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCircle2, Trophy, Lightbulb, User } from 'lucide-react';
import { useActivityStore } from '../../store/useActivityStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadNotificationsCount, markNotificationRead, clearAllNotifications } = useActivityStore();
  const { user } = useAuthStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'tip': return <Lightbulb className="w-5 h-5 text-indigo-500" />;
      case 'system': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default: return <User className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleClearAll = async () => {
    if (user) await clearAllNotifications(user.id);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-neutral-950">
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[500px]"
            >
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Notifications
                </h3>
                {notifications.length > 0 && (
                  <button onClick={handleClearAll} className="text-xs font-medium text-neutral-400 hover:text-white transition-colors">
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-neutral-800/50">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-4 flex gap-4 transition-colors hover:bg-neutral-800/30 ${!notif.read ? 'bg-indigo-500/5' : ''}`}
                        onClick={() => { if (!notif.read) markNotificationRead(notif.id) }}
                      >
                        <div className="shrink-0 mt-1">{getIcon(notif.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-semibold truncate ${!notif.read ? 'text-white' : 'text-neutral-300'}`}>
                            {notif.title}
                          </h4>
                          <p className={`text-xs mt-1 leading-relaxed ${!notif.read ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-2">
                            {new Date(notif.created_at).toLocaleString()}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-neutral-500 flex flex-col items-center">
                    <Bell className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm">You're all caught up!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
