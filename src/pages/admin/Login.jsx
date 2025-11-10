import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Card } from '@components/common/Card';
import { ROUTES } from '@utils/constants';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('admin@selefni.com');
  const [password, setPassword] = useState('admin');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    const success = await login(email, password);
    if (success) {
      navigate(ROUTES.ADMIN_DASHBOARD);
    } else {
      setLocalError('Identifiants invalides');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">SmartCredit</h1>
          <p className="text-gray-600">Espace d'administration</p>
        </div>

        {(error || localError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error || localError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">
            <strong>Compte de démonstration :</strong>
          </p>
          <p className="text-xs text-gray-600">
            Email: <code className="bg-white px-2 py-1 rounded">admin@selefni.com</code>
          </p>
          <p className="text-xs text-gray-600">
            Mot de passe: <code className="bg-white px-2 py-1 rounded">admin</code>
          </p>
        </div>
      </Card>
    </div>
  );
}