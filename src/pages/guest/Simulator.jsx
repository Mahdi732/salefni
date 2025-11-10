import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimulationForm } from '@components/guest/SimulationForm';
import { SimulationResults } from '@components/guest/SimulationResults';
import { useSimulation } from '@hooks/useSimulation';
import { simulateCredit } from '@services/calculations';
import { simulationsAPI } from '@services/api';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';

export default function SimulatorPage() {
  const navigate = useNavigate();
  const { setCurrentSimulation } = useSimulation();
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulation = async (formData) => {
    try {
      setLoading(true);
      
      // Calculate simulation
      const result = simulateCredit(formData);
      
      // Save to backend
      const { data } = await simulationsAPI.create(result);
      
      // Store in context
      setCurrentSimulation(data);
      setSimulationResult(data);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApplication = () => {
    if (simulationResult) {
      navigate('/application');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-600">SmartCredit</h1>
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Retour
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card title="Paramètres de simulation">
              {loading ? (
                <div className="text-center py-8">Calcul en cours...</div>
              ) : (
                <SimulationForm onSimulationComplete={handleSimulation} />
              )}
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {simulationResult ? (
              <>
                <SimulationResults simulation={simulationResult} />
                <div className="mt-4 flex gap-4">
                  <Button
                    onClick={handleCreateApplication}
                    className="flex-1"
                  >
                    Soumettre une demande
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setSimulationResult(null)}
                    className="flex-1"
                  >
                    Nouvelle simulation
                  </Button>
                </div>
              </>
            ) : (
              <Card className="text-center text-gray-600 py-16">
                <p>Remplissez le formulaire et cliquez sur "Simuler"</p>
                <p className="text-sm">pour voir les résultats ici</p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}