import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/common/Button';
import { ROUTES } from '@utils/constants';

export const GuestLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-600 cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
            SmartCredit
          </h1>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => navigate(ROUTES.SIMULATOR)}>
              Simuler
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate(ROUTES.ADMIN_LOGIN)}>
              Admin
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 SmartCredit. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};