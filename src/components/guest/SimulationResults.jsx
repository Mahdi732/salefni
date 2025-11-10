import React from 'react';
import { Card } from '@components/common/Card';
import { Badge } from '@components/common/Badge';
import { AmortizationTable } from './AmortizationTable';
import { formatCurrency, formatPercentage } from '@utils/formatters';

export const SimulationResults = ({ simulation }) => {
  return (
    <div className="space-y-4">
      <Card title="Résumé de la simulation">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Montant emprunté</p>
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(simulation.amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Durée</p>
            <p className="text-2xl font-bold text-primary-600">
              {simulation.months} mois
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mensualité</p>
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(simulation.monthlyPayment)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Coût total</p>
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(simulation.totalCost)}
            </p>
          </div>
        </div>
      </Card>

      <Card title="Détails du crédit">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Taux annuel</span>
            <Badge variant="blue">{formatPercentage(simulation.annualRate)}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">TAEG</span>
            <Badge variant="blue">{formatPercentage(simulation.apr)}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Intérêts totaux</span>
            <span className="font-semibold">{formatCurrency(simulation.totalInterest)}</span>
          </div>
          {simulation.fees > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Frais</span>
              <span className="font-semibold">{formatCurrency(simulation.fees)}</span>
            </div>
          )}
          {simulation.totalInsurance > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Assurance</span>
              <span className="font-semibold">{formatCurrency(simulation.totalInsurance)}</span>
            </div>
          )}
        </div>
      </Card>

      <Card title="Tableau d'amortissement">
        <AmortizationTable amortization={simulation.amortization} />
      </Card>
    </div>
  );
};



 
