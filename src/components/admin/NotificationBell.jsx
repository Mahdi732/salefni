import React, { useState } from 'react';
import { useNotifications } from '@hooks/useNotifications';
import { Badge } from '@components/common/Badge';
import { formatDate } from '@utils/formatters';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsSeen, markAllAsSeen } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <span className="text-2xl">bell</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsSeen()}
                className="text-xs text-primary-600 hover:underline"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-600 text-sm">
              Aucune notification
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  !notif.seen ? 'bg-blue-50' : ''
                }`}
                onClick={() => !notif.seen && markAsSeen(notif.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{notif.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {formatDate(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.seen && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};