import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '@hooks/useApplications';
import { useNotifications } from '@hooks/useNotifications';
import { useAuth } from '@hooks/useAuth';
import { ApplicationsList } from '@components/admin/ApplicationsList';
import { NotificationBell } from '@components/admin/NotificationBell';
import { FiltersBar } from '@components/admin/FiltersBar';
import { Button } from '@components/common/Button';
import { Card } from '@components/common/Card';
import { Badge } from '@components/common/Badge';
import { CREDIT_STATUS, STATUS_LABELS } from '@utils/constants';
import Papa from 'papaparse';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { applications, simulations, loading, refresh } = useApplications();
  const { unreadCount } = useNotifications();
  
  const [filters, setFilters] = useState({
    status: '',
    searchTerm: ''
  });

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      if (filters.status && app.status !== filters.status) return false;
      
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return (
          app.fullName.toLowerCase().includes(term) ||
          app.email.toLowerCase().includes(term) ||
          app.phone.includes(term)
        );
      }
      
      return true;
    });
  }, [applications, filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === CREDIT_STATUS.PENDING).length,
      inProgress: applications.filter(a => a.status === CREDIT_STATUS.IN_PROGRESS).length,
      accepted: applications.filter(a => a.status === CREDIT_STATUS.ACCEPTED).length,
      rejected: applications.filter(a => a.status === CREDIT_STATUS.REJECTED).length
    };
  }, [applications]);

  const handleExportCSV = () => {
    const csvData = filteredApplications.map(app => ({
      'ID': app.id,
      'Nom': app.fullName,
      'Email': app.email,
      'Téléphone': app.phone,
      'Montant': simulations[app.simulationId]?.amount || 'N/A',
      'Statut': STATUS_LABELS[app.status],
      'Date': new Date(app.createdAt).toLocaleDateString('fr-FR'),
      'Notes': app.notes.length
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `demandes-credit-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-600">SmartCredit</h1>
            <p className="text-sm text-gray-600">Administration</p>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationBell />
            {unreadCount > 0 && (
              <Badge variant="red">
                {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
              </Badge>
            )}
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="text-center">
            <p className="text-2xl font-bold text-primary-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </Card>
          <Card className="text-center bg-yellow-50">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">En attente</p>
          </Card>
          <Card className="text-center bg-blue-50">
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-sm text-gray-600">En cours</p>
          </Card>
          <Card className="text-center bg-green-50">
            <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
            <p className="text-sm text-gray-600">Acceptées</p>
          </Card>
          <Card className="text-center bg-red-50">
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            <p className="text-sm text-gray-600">Refusées</p>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Demandes de Crédit</h2>
            <Button size="sm" onClick={handleExportCSV}>
              📥 Export CSV
            </Button>
          </div>
          
          <FiltersBar
            filters={filters}
            onChange={setFilters}
            onRefresh={refresh}
          />
        </Card>

        {/* Applications List */}
        <Card>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <ApplicationsList
              applications={filteredApplications}
              simulations={simulations}
              onRefresh={refresh}
            />
          )}
        </Card>
      </main>
    </div>
  );
}
