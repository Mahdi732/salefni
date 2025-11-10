export const formatCurrency = (amount, currency = 'MAD') => {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]} ${match[6]}`;
  }
  return phone;
};

export const formatPercentage = (value, decimals = 2) => {
  return `${value.toFixed(decimals)} %`;
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};
