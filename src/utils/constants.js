export const CREDIT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};

export const STATUS_LABELS = {
  [CREDIT_STATUS.PENDING]: 'En attente',
  [CREDIT_STATUS.IN_PROGRESS]: 'En cours',
  [CREDIT_STATUS.ACCEPTED]: 'Acceptée',
  [CREDIT_STATUS.REJECTED]: 'Refusée'
};

export const STATUS_COLORS = {
  [CREDIT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [CREDIT_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [CREDIT_STATUS.ACCEPTED]: 'bg-green-100 text-green-800',
  [CREDIT_STATUS.REJECTED]: 'bg-red-100 text-red-800'
};

export const ROUTES = {
  HOME: '/',
  SIMULATOR: '/simulator',
  APPLICATION_CONFIRMATION: '/application-confirmation',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_APPLICATION_DETAIL: '/admin/application/:id'
};

export const API_BASE_URL = '/api';