import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/common/Button';
import { Badge } from '@components/common/Badge';
import { STATUS_LABELS, STATUS_COLORS } from '@utils/constants';
import { formatDate, formatCurrency } from '@utils/formatters';

export const ApplicationsList = ({ applications, simulations, onRefresh }) => {
  const navigate = useNavigate();

  if (!applications.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Aucune demande trouvée</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Montant</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const sim = simulations[app.simulationId];
            return (
              <tr key={app.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{app.fullName}</td>
                <td className="py-3 px-4 text-gray-600">{app.email}</td>
                <td className="py-3 px-4 text-gray-600">
                  {sim ? formatCurrency(sim.amount) : 'N/A'}
                </td>
                <td className="py-3 px-4">
                  <Badge variant={STATUS_COLORS[app.status]?.split(' ')[0]}>
                    {STATUS_LABELS[app.status]}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-gray-600 text-sm">
                  {formatDate(app.createdAt)}
                </td>
                <td className="py-3 px-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/admin/application/${app.id}`)}
                  >
                    Détail →
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};