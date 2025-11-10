import React, { useState } from 'react';
import { Button } from '@components/common/Button';
import { Badge } from '@components/common/Badge';
import { Modal } from '@components/common/Modal';
import { Input } from '@components/common/Input';
import { Select } from '@components/common/Select';
import { Card } from '@components/common/Card';
import { formatCurrency, formatDate, formatPhone } from '@utils/formatters';
import { CREDIT_STATUS, STATUS_LABELS } from '@utils/constants';
import { applicationsAPI } from '@services/api';

export const ApplicationDetail = ({ application, simulation, creditType, onUpdate }) => {
  const [newNote, setNewNote] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(application?.status || CREDIT_STATUS.PENDING);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim() || !application) return;

    try {
      setIsUpdating(true);
      const updatedNotes = [
        ...(application.notes || []),
        {
          id: Date.now(),
          text: newNote,
          createdAt: new Date().toISOString()
        }
      ];

      await applicationsAPI.update(application.id, { notes: updatedNotes });
      setNewNote('');
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async () => {
    if (!application) return;
    
    try {
      setIsUpdating(true);
      await applicationsAPI.update(application.id, { status: selectedStatus });
      setShowStatusModal(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTogglePriority = async () => {
    if (!application) return;
    
    try {
      setIsUpdating(true);
      await applicationsAPI.update(application.id, { priority: !application.priority });
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to toggle priority:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!application) {
    return <Card className="text-center text-gray-600 py-8">Aucune demande sélectionnée</Card>;
  }

  const statusColors = {
    'pending': 'yellow',
    'in_progress': 'blue',
    'accepted': 'green',
    'rejected': 'red'
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Info */}
          <Card title="Informations du demandeur">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Nom</p>
                <p className="text-lg font-semibold text-gray-900">{application.fullName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a href={`mailto:${application.email}`} className="text-primary-600 hover:underline">
                    {application.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <a href={`tel:${application.phone}`} className="text-primary-600 hover:underline">
                    {formatPhone(application.phone)}
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Revenu mensuel</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(application.monthlyIncome)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type d'emploi</p>
                  <p className="text-base text-gray-900">{application.employmentTypeId}</p>
                </div>
              </div>
              {application.comment && (
                <div>
                  <p className="text-sm text-gray-600">Commentaire</p>
                  <p className="text-base italic text-gray-700">"{application.comment}"</p>
                </div>
              )}
            </div>
          </Card>

          {/* Simulation Info */}
          {simulation && (
            <Card title="Détails de la simulation">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Type de crédit</p>
                  <p className="font-semibold text-gray-900">{creditType?.label || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Montant</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(simulation.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Durée</p>
                  <p className="font-semibold text-gray-900">{simulation.months} mois</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mensualité</p>
                  <p className="font-semibold text-primary-600">
                    {formatCurrency(simulation.monthlyPayment)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Coût total</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(simulation.totalCost)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">TAEG</p>
                  <p className="font-semibold text-gray-900">{simulation.apr.toFixed(2)}%</p>
                </div>
              </div>
            </Card>
          )}

          {/* Notes */}
          <Card title="Notes internes">
            <div className="space-y-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ajouter une note..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
              />
              <Button
                onClick={handleAddNote}
                disabled={isUpdating || !newNote.trim()}
                className="w-full"
              >
                {isUpdating ? 'Ajout...' : 'Ajouter une note'}
              </Button>

              {application.notes && application.notes.length > 0 && (
                <div className="mt-6 space-y-3 border-t pt-4">
                  {application.notes.map((note) => (
                    <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{note.text}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card title="Statut">
            <div className="space-y-4">
              <div className="text-center">
                <Badge
                  variant={statusColors[application.status] || 'gray'}
                  size="lg"
                >
                  {STATUS_LABELS[application.status] || application.status}
                </Badge>
              </div>

              <Button
                onClick={() => setShowStatusModal(true)}
                className="w-full"
              >
                Modifier le statut
              </Button>

              <Button
                onClick={handleTogglePriority}
                variant={application.priority ? 'danger' : 'secondary'}
                className="w-full"
                disabled={isUpdating}
              >
                {application.priority ? '⭐ Prioritaire' : '☆ Non prioritaire'}
              </Button>
            </div>
          </Card>

          {/* Metadata */}
          <Card title="Métadonnées">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">ID Demande</p>
                <p className="text-sm font-mono text-gray-900">{application.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Créée le</p>
                <p className="text-sm text-gray-900">{formatDate(application.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Modifiée le</p>
                <p className="text-sm text-gray-900">{formatDate(application.updatedAt)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Status Change Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Modifier le statut"
        actions={[
          <Button
            key="cancel"
            variant="secondary"
            onClick={() => setShowStatusModal(false)}
          >
            Annuler
          </Button>,
          <Button
            key="confirm"
            onClick={handleStatusChange}
            disabled={isUpdating}
          >
            {isUpdating ? 'Mise à jour...' : 'Confirmer'}
          </Button>
        ]}
      >
        <div className="space-y-4">
          <p className="text-gray-600">Sélectionnez le nouveau statut :</p>
          <div className="space-y-3">
            {Object.values(CREDIT_STATUS).map((status) => (
              <label key={status} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={selectedStatus === status}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="mr-3"
                />
                <span className="text-sm font-medium text-gray-700">{STATUS_LABELS[status]}</span>
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
