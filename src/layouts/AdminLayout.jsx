import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/common/Button';

export const AdminLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-600">SmartCredit</h1>
            <p className="text-sm text-gray-600">Administration</p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};