import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSimulation } from '@hooks/useSimulation';
import { GuestLayout } from '@layouts/GuestLayout';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { ROUTES } from '@utils/constants';

export default function ApplicationConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSimulation } = useSimulation();
  const applicationId = location.state?.applicationId;

  return (
    <GuestLayout
      title="Demande Enregistrée"
      subtitle="Merci de votre candidature"
    >
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-green-600">Demande Reçue</h2>
          </div>

          <p className="text-gray-600 mb-4">
            Votre demande de crédit a bien été enregistrée dans notre système.
          </p>

          {applicationId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Numéro de suivi</p>
              <p className="text-2xl font-bold text-primary-600">#{applicationId}</p>
            </div>
          )}

          <p className="text-gray-600 mb-8">
            Vous allez recevoir un email de confirmation à bientôt.
            Notre équipe examinera votre dossier et vous contactera sous peu.
          </p>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate(ROUTES.HOME)}>
              Retour à l'accueil
            </Button>
            <Button variant="secondary" onClick={() => navigate(ROUTES.SIMULATOR)}>
              Nouvelle simulation
            </Button>
          </div>
        </Card>

        <Card className="mt-8" title="Prochaines Étapes">
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="text-primary-600 font-bold">1.</span>
              <span>Vous recevrez un email de confirmation avec les détails de votre demande</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary-600 font-bold">2.</span>
              <span>Notre équipe étudiera votre dossier (délai: 2-3 jours)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary-600 font-bold">3.</span>
              <span>Vous serez contacté par téléphone ou email pour les étapes suivantes</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary-600 font-bold">4.</span>
              <span>En cas d'accord, signature numérique et déblocage des fonds</span>
            </li>
          </ul>
        </Card>
      </div>
    </GuestLayout>
  );
}