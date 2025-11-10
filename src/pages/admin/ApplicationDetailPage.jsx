import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationsAPI, simulationsAPI, creditTypesAPI } from '@services/api';
import { Button } from '@components/common/Button';
import { Card } from '@components/common/Card';
import { Badge } from '@components/common/Badge';
import { Input } from '@components/common/Input';
import { Select } from '@components/common/Select';
import { Modal } from '@components/common/Modal';
import { formatCurrency, formatDate, formatPhone } from '@utils/formatters';
import { CREDIT_STATUS, STATUS_LABELS } from '@utils/constants';

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [creditType, setCreditType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(CREDIT_STATUS.PENDING);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch application
        const { data: appData } = await applicationsAPI.getById(id);
        setApplication(appData);
        setSelectedStatus(appData.status);

        // Fetch simulation
        const { data: simData } = await simulationsAPI.getById(appData.simulationId);
        setSimulation(simData);

        // Fetch credit type
        const { data: creditTypes } = await creditTypesAPI.getAll();
        const type = creditTypes.find(ct => ct.id === appData.creditTypeId);
        setCreditType(type);
      } catch (error) {
        console.error('Failed to fetch application details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      setUpdating(true);
      const updatedNotes = [
        ...application.notes,
        {
          id: Date.now(),
          text: newNote,
          createdAt: new Date().toISOString()
        }
      ];

      await applicationsAPI.update(id, { notes: updatedNotes });
      setApplication({ ...application, notes: updatedNotes });
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      setUpdating(true);
      await applicationsAPI.update(id, { status: selectedStatus });
      setApplication({ ...application, status: selectedStatus });
      setShowStatusModal(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleTogglePriority = async () => {
    try {
      setUpdating(true);
      await applicationsAPI.update(id, { priority: !application.priority });
      setApplication({ ...application, priority: !application.priority });
    } catch (error) {
      console.error('Failed to toggle priority:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Demande non trouvée</p>
        <Button onClick={() => navigate('/admin/dashboard')} className="mt-4">
          Retour au dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-600">SmartCredit</h1>
          <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
            ← Retour
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Info */}
            <Card title="Informations du demandeur">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Nom</p>
                  <p className="text-lg font-semibold">{application.fullName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-base">{application.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="text-base">{formatPhone(application.phone)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Revenu mensuel</p>
                    <p className="text-base font-semibold">
                      {formatCurrency(application.monthlyIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Situation professionnelle</p>
                    <p className="text-base">{application.employmentTypeId}</p>
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
                    <p className="font-semibold">{creditType?.label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Montant</p>
                    <p className="font-semibold">{formatCurrency(simulation.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Durée</p>
                    <p className="font-semibold">{simulation.months} mois</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mensualité</p>
                    <p className="font-semibold text-primary-600">
                      {formatCurrency(simulation.monthlyPayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Coût total</p>
                    <p className="font-semibold">{formatCurrency(simulation.totalCost)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">TAEG</p>
                    <p className="font-semibold">{simulation.apr.toFixed(2)}%</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Notes */}
            <Card title="Notes internes">
              <div className="space-y-4">
                <div>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Ajouter une note..."
                    className="input min-h-24"
                  />
                </div>
                <Button
                  onClick={handleAddNote}
                  disabled={updating || !newNote.trim()}
                  className="w-full"
                >
                  {updating ? 'Ajout...' : 'Ajouter une note'}
                </Button>

                {application.notes.length > 0 && (
                  <div className="mt-6 space-y-3 border-t pt-4">
                    {application.notes.map((note) => (
                      <div key={note.id} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{note.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
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
                    variant={
                      application.status === CREDIT_STATUS.PENDING ? 'yellow' :
                      application.status === CREDIT_STATUS.IN_PROGRESS ? 'blue' :
                      application.status === CREDIT_STATUS.ACCEPTED ? 'green' :
                      'red'
                    }
                    className="inline-block"
                  >
                    {STATUS_LABELS[application.status]}
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
                  disabled={updating}
                >
                  {application.priority ? '⭐ Prioritaire' : '☆ Non prioritaire'}
                </Button>
              </div>
            </Card>

            {/* Metadata */}
            <Card title="Métadonnées">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Créée le</p>
                  <p className="text-sm">{formatDate(application.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Modifiée le</p>
                  <p className="text-sm">{formatDate(application.updatedAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">ID</p>
                  <p className="text-sm font-mono">{application.id}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

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
            disabled={updating}
          >
            {updating ? 'Mise à jour...' : 'Confirmer'}
          </Button>
        ]}
      >
        <div className="space-y-4">
          <p className="text-gray-600">Sélectionnez le nouveau statut :</p>
          <div className="space-y-2">
            {Object.values(CREDIT_STATUS).map((status) => (
              <label key={status} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={selectedStatus === status}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="mr-3"
                />
                <span className="text-sm">{STATUS_LABELS[status]}</span>
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}