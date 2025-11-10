import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/common/Button';
import { Card } from '@components/common/Card';
import { ROUTES } from '@utils/constants';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-600">SmartCredit</h1>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate(ROUTES.SIMULATOR)}>
              Simuler
            </Button>
            <Button variant="secondary" onClick={() => navigate(ROUTES.ADMIN_LOGIN)}>
              Admin
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simulez votre crédit
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Trouvez le crédit qui vous convient en quelques clics. 
            Obtenez une simulation complète avec tableau d'amortissement détaillé.
          </p>
          <Button
            size="lg"
            onClick={() => navigate(ROUTES.SIMULATOR)}
          >
            Commencer une simulation
          </Button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card title="Crédit Auto" className="text-center">
            <p className="text-gray-600 mb-4">
              Pour l'achat de votre véhicule personnel ou professionnel
            </p>
            <p className="text-2xl font-bold text-primary-600">Dès 4.2%</p>
          </Card>

          <Card title="Crédit Consommation" className="text-center">
            <p className="text-gray-600 mb-4">
              Pour tous vos projets et envies du quotidien
            </p>
            <p className="text-2xl font-bold text-primary-600">Dès 6.8%</p>
          </Card>

          <Card title="Crédit Immobilier" className="text-center">
            <p className="text-gray-600 mb-4">
              Pour l'acquisition ou la construction immobilière
            </p>
            <p className="text-2xl font-bold text-primary-600">Dès 4%</p>
          </Card>
        </section>

        <section className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Comment ça marche ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Remplissez", desc: "Les paramètres de votre crédit" },
              { step: 2, title: "Simulez", desc: "Obtenez les calculs instantanés" },
              { step: 3, title: "Demandez", desc: "Soumettez votre demande" },
              { step: 4, title: "Attendez", desc: "La réponse de notre équipe" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}