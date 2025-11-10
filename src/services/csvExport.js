import Papa from 'papaparse';
import { formatCurrency, formatDate } from '@utils/formatters';
import { STATUS_LABELS } from '@utils/constants';

export const exportApplicationsCSV = (applications, simulations) => {
  const data = applications.map(app => {
    const sim = simulations[app.simulationId];
    return {
      'ID': app.id,
      'Nom': app.fullName,
      'Email': app.email,
      'Téléphone': app.phone,
      'Type d\'Emploi': app.employmentTypeId,
      'Métier': app.jobId,
      'Revenu Mensuel (MAD)': app.monthlyIncome,
      'Type de Crédit': sim?.creditTypeId || 'N/A',
      'Montant (MAD)': sim?.amount || 'N/A',
      'Durée (mois)': sim?.months || 'N/A',
      'Mensualité (MAD)': sim?.monthlyPayment || 'N/A',
      'Statut': STATUS_LABELS[app.status],
      'Prioritaire': app.priority ? 'Oui' : 'Non',
      'Notes': app.notes.length,
      'Créée le': formatDate(app.createdAt),
      'Modifiée le': formatDate(app.updatedAt)
    };
  });

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `demandes-credit-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const exportSimulationsCSV = (simulations) => {
  const data = simulations.map(sim => ({
    'ID': sim.id,
    'Type de Crédit': sim.creditTypeId,
    'Montant (MAD)': sim.amount,
    'Durée (mois)': sim.months,
    'Taux Annuel (%)': sim.annualRate,
    'Mensualité (MAD)': sim.monthlyPayment,
    'Coût Total (MAD)': sim.totalCost,
    'TAEG (%)': sim.apr,
    'Intérêts Totaux (MAD)': sim.totalInterest,
    'Créée le': formatDate(sim.createdAt)
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `simulations-credit-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};
