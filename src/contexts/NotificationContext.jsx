import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import { notificationsAPI } from '@services/api';

export const NotificationContext = createContext();

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.seen).length
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    case 'MARK_AS_SEEN':
      const updated = state.notifications.map(n =>
        n.id === action.payload ? { ...n, seen: true } : n
      );
      return {
        ...state,
        notifications: updated,
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    case 'MARK_ALL_SEEN':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, seen: true })),
        unreadCount: 0
      };
    case 'LOADING':
      return { ...state, loading: true };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const fetchNotifications = useCallback(async () => {
    dispatch({ type: 'LOADING' });
    try {
      const { data } = await notificationsAPI.getAll();
      dispatch({ type: 'SET_NOTIFICATIONS', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
    }
  }, []);

  const markAsSeen = useCallback(async (id) => {
    dispatch({ type: 'MARK_AS_SEEN', payload: id });
    try {
      await notificationsAPI.markAsSeen(id);
    } catch (error) {
      console.error('Failed to mark notification as seen', error);
    }
  }, []);

  const markAllAsSeen = useCallback(async () => {
    dispatch({ type: 'MARK_ALL_SEEN' });
    try {
      await notificationsAPI.markAllAsSeen();
    } catch (error) {
      console.error('Failed to mark all notifications as seen', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const value = {
    ...state,
    fetchNotifications,
    markAsSeen,
    markAllAsSeen
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};